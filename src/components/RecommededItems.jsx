import ReactMarkdown from "react-markdown"

export default function RecommendItems({ AiGeneratedRecommendations }) {

  return (
    <section className="suggested-recipe-container">
      <h2>Remember 2 Pack: </h2>
      <ReactMarkdown>{AiGeneratedRecommendations}</ReactMarkdown>
    </section>
  )

}