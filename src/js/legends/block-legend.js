import * as d3 from 'd3'
import utils from '../../js/utils'

const blockLegend = {
  init () {

  },
  create (el, props, state) {
	  if (state === undefined) {
	    return
	  }
    let self = this
  },
  update (el, props, state) {
    if (state === undefined) {
      return
    }
    let self = this
  },
  destroy (el) {
    // window.removeEventListener("resize", utils.throttle(this.update.bind(this), 200));
  },
}

export default blockLegend
