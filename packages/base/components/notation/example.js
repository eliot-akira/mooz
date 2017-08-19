import { C, Block } from 'core'
import Notation from './index'

export default function createExample({ title, file }) {

  const Page = C(({ scores, ...props }) =>
    <div>
      <h3>Notation: {title}</h3>
      { scores.map((s, i) =>
        <div key={i}>
          <small>{ s.filename }</small>
          <Block>
            <Notation {...{ ...s, ...props }} />
          </Block>
        </div>
      )}
    </div>
  )

  Page.getInitialProps = async (props) => {

    if (props.scores) return

    const { api } = props

    const files = !Array.isArray(file) ? [file] : file

    const scores = await Promise.all(files.map(async f => ({
      filename: f,
      xml: await api.get(`/static/mooz/scores/test/${f}.xml`)
    })))

    return { scores }
  }

  return Page
}