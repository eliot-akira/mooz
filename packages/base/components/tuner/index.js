import { C, Block, Button, Icon, Label, Row } from 'core'
import initArray from '../../util/initArray'
import { createTuner, removeTuner } from './tuner'

const semitoneDivisions = 3
const semitoneDivisionsArray = initArray(semitoneDivisions)
const createState = () => ({
  name: '',
  frequency: 0,
  sharp: 0,
  flat: 0,
  active: false
})
const percent = 100 / ((semitoneDivisions * 2) + 3)
const stepWidth = percent+'%'
const noteWidth = (percent*3)+'%'
const grays = ['#fff', '#f0f0f0', '#eee', '#e0e0e0']
const colors = ['#3F86ce', '#ffd600', '#ff851b', '#e74c3c']
//const colors = ['white', 'black', 'black', 'white']

export default C({

  state: createState(),

  render() {

    const offBy = this.state.sharp+this.state.flat

    return (
      <Block>

        <div className="tuner">

          <div className="main"
            {...(!this.state.active
              ? {
                title: 'Microphone on',
                style: { cursor: 'pointer' },
                onClick: this.turnOn
              }:{

              })}
          >


            {!this.state.active ? null :
            <div className="on-off"
              style={{
                color: this.state.active ? colors[offBy] : '#555'
              }}
            >
              <Button plain onClick={this.state.active?this.turnOff:this.turnOn}
                title={'Microphone '+(this.state.active ?'off':'on')}
                >
                <Icon name={this.state.active ?'mic':'mute'}
                />
              </Button>
            </div>
            }

            <div className="inner"
              style={{
                backgroundColor: grays[offBy] || '#fafafa'
              }}
            >
            {semitoneDivisionsArray.map((i, index) => {
              const active = this.state.flat >= (semitoneDivisions-index)
              return (
                <div key={index} className={`step${ active?' active':''}`}
                  style={{ width:stepWidth }}>
                  { active ? <Icon name="right-open" small /> : null }
                </div>
              )
            })}

            <div className={`step note-name${this.state.active?' active':''}`} style={{ width:noteWidth }}>
              { this.state.active ? this.state.name :
                //<Icon name="spinner" spin />
                <Icon name="mute" />
              }
            </div>

            {semitoneDivisionsArray.map((i, index) => {
              const active = this.state.sharp >= (index+1)
              return (
                <div key={index} className={`step${ active?' active':''}`}
                  style={{ width:stepWidth }}>
                  { active ? <Icon name="left-open" small /> : null }
                </div>
              )
            })}


            </div>

            <div className={`freq${
              offBy===0 ? ' in-tune' : ''
            }`}>{this.state.frequency.toFixed(2) } Hz</div>

          </div>

        </div>

        <style jsx>{`
          .tuner {
            position: relative;
            text-align: center;
            width: 100%;
          }
          .main {
            position: relative;
            max-width: 22rem;
            margin: 0 0 .75rem;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
          .tuner:before, .tuner:after,
          .inner:before, .inner:after {
            display: table;
            clear: both;
          }
          .inner {
            height: 10rem;
            transition: background-color .2s;
          }
          .on-off {
            position:absolute; top: 0; right: 0;
            transition: color .2s;
          }
          .step {
            float: left;
            line-height: 10rem;
            vertical-align: middle;
            min-height: 1px;
          }
          .step.active {
          }
          .note-name {
            font-family: Times, "Times New Roman", serif;
            font-size: 220%;
            padding: 0 .5rem;
          }
          .note-name.active { font-weight: 600 }
          .freq {
            clear: both;
            width:100%;
            text-align: center;
            font-size:80%;
            border-top: 1px solid #ddd;
            padding: .25rem;
          }
          .freq.in-tune { font-weight: 600 }
        `}</style>
      </Block>
    )
  },

  turnOn() {
    this.setState({ active: true })
    createTuner({
      onResult: this.onResult
    })
    .then(() => {})
    .catch(e => {
      console.error(e)
      this.setState({ active: false })
    })
  },

  turnOff(update = true) {
    removeTuner()
    .then(() => update && this.setState(createState()))
    .catch(e => console.error(e))
  },

  onResult(data) {
    //console.log('RESULT', data)
    this.setState({ ...data, active: true })
  },

  didMount() {
    console.log('Tuner mounted')
    this.turnOn()
  },

  willUnmount() {
    this.turnOff(false)
  },
})
