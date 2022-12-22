type Props = {
    data: string[]
}
const Select = ({data}: Props) => {
    return (
        <select>
          {data.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
    )
}
export default Select;