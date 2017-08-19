export default (props) => {

  let {
    type = 'white',
    highlight = false,
    label = null,
    marker = false,
    markerClass = null,
    onNoteDown = null,
    onNoteUp = null,
  } = props

  return (
    <div className={[ "piano--key", `piano--${type}-key`,
      highlight ? 'piano--key-highlight' : null
    ].join(' ')}
      //onMouseEnter={() => onNoteDown && onNoteDown()}
      //onMouseLeave={() => onNoteUp && onNoteUp()}
    >
      <div className="piano--key-text">{ label }</div>
      {
        !marker && !markerClass ? null :
          <div className="piano--key-marker">
            <div className={["piano--key-marker-dot", markerClass].join(' ')}></div>
          </div>
      }
    </div>
  )
}
/*

      { label
          ?
          : <div class="piano--key-text-empty"></div>
      }


*/