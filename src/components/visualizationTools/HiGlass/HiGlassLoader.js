import { connect } from 'react-redux';
import { setViewConfig } from './index';
import HiGlassLauncher from './HiGlassLauncher';

const mapStateToProps = state => ({
  mouseTool: state.present.viewerMouseTool,
  viewConfig: state.present.viewConfig,
});

const mapDispatchToProps = dispatch => ({
  setViewConfig: (viewConfig) => {
    dispatch(setViewConfig(viewConfig));
  },
});

const HiGlassLoader = connect(
  mapStateToProps,
  mapDispatchToProps
)(HiGlassLauncher);

export default HiGlassLoader;
