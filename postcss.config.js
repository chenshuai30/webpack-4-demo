// module.exports = {
//     plugins: {
//         "autoprefixer": {}
//     }
// }
module.exports = {
    plugins: [
        require('cssnano'), 
        require('autoprefixer')({browsers: [ 'last 2 version', '> 1%', 'not ie < 8']})
    ]
}