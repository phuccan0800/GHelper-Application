const GetHomePage = (req, res) => {
    res.render('index.ejs');
}

const GetTTP = (req, res) => {
    res.send('Fuck you');
}

module.exports = {
    GetHomePage, GetTTP
}