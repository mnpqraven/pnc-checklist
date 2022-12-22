import DollListItem from "./DollListItem";

const DollList = ({ list }: { list: string[] }) => (
  <ul>
    {list.map((item) => (
      <li key={item}>
        <DollListItem data={item} />
      </li>
    ))}
  </ul>
)
export default DollList;
