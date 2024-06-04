const connection = require('../config/database');

const GetHomePage = (req, res) => {
    return res.send('HELLO');
}

const GetTTP = (req, res) => {
    connection.query(
        'SELECT username FROM users WHERE ID = 1',
        function (err, results, fields) {
            res.send(JSON.stringify(results));
        }
    );

}

module.exports = {
    GetHomePage, GetTTP
}