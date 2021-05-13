import AileChart from './src/Chart';

const extraOptions = {};
const themeOptions = {};

AileChart.install = function(Vue, option = {}) {
  const defaultOption = {
    notMerge: false,
    autoResize: false
  };
  const themes = option.themes || [];
  themes.forEach(it => {
    AileChart.registerTheme(it.name, it.theme);
    extraOptions[it.name] = it.extra;
    themeOptions[it.name] = it.theme;
  });
  const maps = option.maps || [];
  maps.forEach(it => {
    AileChart.registerMap(it.name, it.map, it.specialAreas);
  });
  delete option.themes;
  delete option.maps;
  Vue.prototype.$aileChart = {
    ...defaultOption,
    ...option,
    extraOptions
  };
  Vue.component(AileChart.name, AileChart);
};

export default AileChart;

export function getExtraOption(theme, path) {
  if (!path) {
    try {
      return extraOptions[theme];
    } catch (error) {
      throw new Error(error);
    }
  } else {
    try {
      const obj = extraOptions[theme] || {};
      return path.split('.').reduce((obj, k) => obj[k], obj);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export function getThemeOption(theme, path) {
  if (!path) {
    try {
      return themeOptions[theme];
    } catch (error) {
      throw new Error(error);
    }
  } else {
    try {
      const obj = themeOptions[theme] || {};
      return path.split('.').reduce((obj, k) => obj[k], obj);
    } catch (error) {
      throw new Error(error);
    }
  }
}
