import Link from "next/link";

function ShouldSee() {
  return (
    <div>
      <h1>doll_list page!</h1>
      <button type="button"> <Link href={"/"}>
        go to home</Link> </button>
    </div>
  )
}

export default ShouldSee;