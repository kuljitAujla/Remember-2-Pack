export default function packedList({ listOfItems }) {


  const packedItemsList = listOfItems.map( item => (
    <li key={item}>{item}</li>
  ))

  return(
    <section>
        <h2>Packed So Far:</h2>
        <ul className="items-list" aria-live="polite">{packedItemsList}</ul>
      </section>
  )
}