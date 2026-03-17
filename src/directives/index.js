import directiveFtime from './ftime'
import directiveLazy from './lazy'
import directiveUnit from './unit'

export default function registerDirectives(app) {
  directiveFtime(app)
  directiveLazy(app)
  directiveUnit(app)
}
