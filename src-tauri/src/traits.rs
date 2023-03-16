pub trait FromAsync<T>: Sized {
    async fn from_async(value: T) -> Self;
}
