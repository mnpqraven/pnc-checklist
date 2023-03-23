use crate::loadout::types::LoadoutType;
use crate::prisma::PrismaClient;
use crate::service::db::get_db;
use crate::stats::types::*;
use crate::{algorithm::types::*, service::errors::RequirementError};
use futures::StreamExt;
use prisma_client_rust::QueryError;
use rspc::Type;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

// pub trait Requirement {
//     async fn calculate<T>(&self, cal_fun: fn()) -> Result<Self, RequirementError<T>>;
// }

/// struct for the requirement screen, gathers all requirements needed, single
///  requirement can be accessed by fields
/// SoSoA
#[derive(Debug)]
pub struct DatabaseRequirement {
    pub unit_req: Vec<UnitRequirement>,
}

/// struct for single unit
#[derive(Debug)]
pub struct UnitRequirement {
    pub skill: SkillResourceRequirement,
    pub neural: NeuralResourceRequirement,
    pub level: LevelRequirement,
    pub breakthrough: WidgetResourceRequirement,
    pub algo: AlgorithmRequirement,
    pub unit_id: Option<String>,
}

/// Tokens and pivots a unit would need to max out its skill
#[derive(Serialize, Deserialize, Debug, Type)]
pub struct SkillResourceRequirement {
    pub token: u32,
    pub pivot: u32,
    pub coin: Coin,
    pub from_unit_id: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Default, Type)]
pub struct LevelRequirement {
    pub exp: Exp,
    pub from_unit_id: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Default, Type)]
pub struct WidgetResourceRequirement {
    pub widget: WidgetResource,
    pub coin: Coin,
    pub from_unit_id: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Default, Type)]
pub struct NeuralResourceRequirement {
    #[serde(default)]
    pub frags: NeuralFragment,
    pub coin: Coin,
    pub kits: u32,
    pub from_unit_id: Option<String>,
}

// NOTE: probably need to consider what fields are needed here
#[derive(Debug, Serialize, Deserialize, Default, Type)]
pub struct AlgorithmRequirement {
    pub pieces: Vec<IAlgoPiece>,
    pub from_unit_id: Option<String>,
}

pub trait PrismaData: Clone {
    async fn get_unit_id(&self) -> Option<String>;
    async fn get_loadout_type(&self) -> Option<LoadoutType>;
}

pub trait TRequirement {
    type Input;
    type Output;
    type Contraints: Clone;
    type ErrorType;
    type PrismaType: PrismaData;

    /// Specify the field in the prisma data that needs to be evaluated
    ///
    /// * `prisma_data`: the prisma data
    fn choose_field(prisma_data: Self::PrismaType) -> Self::Input;

    /// Get a clean item in the database to compare to in case the user only
    /// updates one loadout of an unit instead of both (in this case there
    /// will be only one side of items in the transaction list and we need to
    /// calculate with current data in the database)
    ///
    /// * `client`: prisma client
    /// * `from`: the result should have the same unit id as `from`
    /// * `next_loadout_type`: the result should have its `loadoutType` equal
    /// to this
    async fn get_db_to(
        client: Arc<PrismaClient>,
        from: Self::PrismaType,
        next_loadout_type: LoadoutType,
    ) -> Result<Option<Self::PrismaType>, QueryError>;

    async fn calculate_algorithm(
        from: Self::Input,
        to: Option<Self::Input>,
        extra_constraints: Option<Self::Contraints>,
        from_unit_id: Option<String>,
    ) -> Result<Self::Output, RequirementError<Self::ErrorType>>;

    /// finds the corresponding loadout item from the current batch
    /// transaction (that is getting sent from the frondend). If there's none
    /// (because the user only edits one loadout in an unit), then get the
    /// corresponding loadout from the database
    async fn get_from_to_tuple(
        from: Self::PrismaType,
        transaction_list: &[Self::PrismaType],
        using_tos: bool
    ) -> Result<(Self::Input, Option<Self::Input>), QueryError> {
        let client = get_db().await;
        // other loadout not in bucket, check with db
        // TODO: helper fn to return loadoutType for other db structs
        let next_loadout_type = match from.get_loadout_type().await.unwrap() {
            LoadoutType::Current => LoadoutType::Goal,
            LoadoutType::Goal => LoadoutType::Current,
        };
        // other loadout in bucket
        let mut to_lo = futures::stream::iter(transaction_list)
            .filter_map(|lo| {
                Box::pin(async {
                    let same_id = lo.get_unit_id().await == from.get_unit_id().await;
                    let same_lo_type = lo.get_loadout_type().await == Some(next_loadout_type);
                    match same_id && same_lo_type {
                        true => Some(lo.clone()),
                        false => None,
                    }
                })
            })
            .next()
            .await;

        // other loadout not in bucket, check with db
        if to_lo.is_none() {
            to_lo = Self::get_db_to(client.clone(), from.clone(), next_loadout_type).await?;
        }
        match using_tos {
            true => Ok((Self::choose_field(from), Some(Self::choose_field(to_lo.unwrap())))),
            false => Ok((Self::choose_field(from), None))
        }
    }

    async fn calculate(
        transaction_list: Vec<Self::PrismaType>,
        extra_constraints: Option<Self::Contraints>,
        using_tos: bool,
        from_unit_id: Option<String>,
    ) -> Result<Vec<Self::Output>, rspc::Error> {
        let validation_iter = transaction_list
            .clone()
            .into_iter()
            .map(|ongoing_item| async {
                let (from, to) = Self::get_from_to_tuple(ongoing_item, &transaction_list, using_tos)
                    .await
                    .unwrap();
                Self::calculate_algorithm(from, to, extra_constraints.clone(), from_unit_id.clone())
                    .await
                    .map_err(|_| {
                        rspc::Error::new(rspc::ErrorCode::BadRequest, "Validation failed".into())
                    })
            });
        futures::future::try_join_all(validation_iter).await
    }
}
