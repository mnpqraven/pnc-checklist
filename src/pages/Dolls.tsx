import rspc from "../rspc";

function Dolls() {
  const test = rspc.createQuery(() => ["units"]);

  return (
    <ul>
      {test.data?.map((item) => (
        <li>{item.name}</li>
      ))}
    </ul>
  );
}
export default Dolls;
