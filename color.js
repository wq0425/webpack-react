const path = require('path');
const { generateTheme } = require('antd-theme-generator');

const options = {
  stylesDir: path.join(__dirname, './src/styles'),// 指定了我们用来定制主题的less文件的路径；
  antDir: path.join(__dirname, './node_modules/antd'),// 指定了ant design依赖的路径；
  varFile: path.join(__dirname, './src/styles/vars.less'),// 指定了要动态切换的less变量所在的文件的路径；
  mainLessFile: path.join(__dirname, './src/styles/main.less'),// 指定了你编写的样式文件，也就是index.less文件的路径，要在这个文件中编写我们需要动态切换的样式，并将vars.less中的less变量应用到我们编写的样式中；
  themeVariables: [// 数组指定所有我们自定义的需要切换的样式变量。
    '@primary-color',
    '@secondary-color',
    '@text-color',
    '@text-color-secondary',
    '@heading-color',
    '@layout-body-background',
    '@btn-primary-bg',
    '@layout-header-background'
  ],
  // indexFileName: 'index.html',
  outputFilePath: path.join(__dirname, './src/static/color.less'),//  输出less文件路径
}

generateTheme(options).then(less => {
  console.log('Theme generated successfully');
})
  .catch(error => {
    console.log('Error', error);
  });