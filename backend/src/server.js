const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require('body-parser');
const dotenv = require("dotenv");  // Add dotenv to load environment variables

// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === "production") {
    dotenv.config({ path: ".env.production" });
} else {
    dotenv.config({ path: ".env.development" });
}

const app = express();
app.use(express.json());
app.use(cors()); // Allow HTTP to request localhost
app.use(bodyParser.urlencoded({ extended: true }));

// Get the environment variables
const DB_HOST = process.env.DB_HOST || "localhost"; // Default to localhost if not defined
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "123";
const DB_NAME = process.env.DB_NAME || "lms";

const db = mysql.createConnection({
    host: DB_HOST, // Use the DB_HOST environment variable
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
});

function connectWithRetry(retries = 5, delay = 3000) {
    db.connect((err) => {
        if (err) {
            if (retries === 0) {
                console.error("❌ Could not connect to database after multiple attempts:", err);
                process.exit(1); // exit if all retries fail
            } else {
                console.warn(`⚠️ DB connection failed. Retrying in ${delay / 1000}s... (${retries} retries left)`);
                setTimeout(() => connectWithRetry(retries - 1, delay), delay);
            }
        } else {
            console.log("✅ Connected to database");
            // you can start your routes or app logic here
        }
    });
}

connectWithRetry();

app.get("/AllUsersData", (req, res) => {
    const sql = "SELECT * FROM user INNER JOIN teams ON user.Team_id = teams.ID ";
    db.query(sql, (err, data) => {
        if (err) {
            return res.json("Error");
        } else {
            return res.json(data);
        }
    });
});

///////
app.get("/EmployeeData/:id", (req, res) => {
    
    const sql = "SELECT * FROM user INNER JOIN training ON user.user_id = training.Emp_id  where user_id=?";
    const id=req.params.id;
    db.query(sql,[id], (err, data) => {
        if (err) {
            return res.json("Error");
        } else {
            console.log(data);
            return res.json(data);
        }
    });
});

app.get("/AllEmployeeData", (req, res) => {
    
    const sql = "SELECT * FROM user INNER JOIN training ON user.user_id = training.Emp_id";
    const id=req.params.id;
    db.query(sql,[id], (err, data) => {
        if (err) {
            return res.json("Error");
        } else {
            console.log(data);
            return res.json(data);
        }
    });
});
/////
app.get("/AllTeamLeaderData/:id", (req, res) => {
    
    const sql = "SELECT * FROM user where user_id=?";
    const id=req.params.id;
    db.query(sql,[id], (err, data) => {
        if (err) {
            return res.json("Error");
        } else {
            console.log(data);
            return res.json(data);
        }
    });
});
app.get("/MemberData/:id", (req, res) => {
    const sql = "SELECT * FROM user JOIN teams ON user.Team_id = teams.ID JOIN training ON user.user_id = training.Emp_id where teams.ID=?  ";
    const id=req.params.id;
    db.query(sql,[id], (err, data) => {
        if (err) {
            
            return res.json("Error");
        } else {
            

            console.log(data);
            return res.json(data);
        }
    });
});
//////
app.get("/AllTeamMemberData/:id", (req, res) => {
    
    const sql = "SELECT * FROM teams JOIN user ON teams.ID = user.Team_id where teams.ID=? ";
    const id=req.params.id;
    db.query(sql,[id], (err, data) => {
        if (err) {
            return res.json("Error");
        } else {
            console.log(data);
            return res.json(data);
        }
    });
});
//////
app.get("/view_ID", (req, res) => {
    
    const sql = "SELECT `ID` FROM teams";
    db.query( sql, (err, data) => {
        if (err) {
            return res.json("error");
        }
        else{
            //console.log(data);
            return res.json(data);
        }
    });
});

app.get("/AllTeam_IDS", (req, res) => {
    
    const sql = "SELECT * FROM teams";
    db.query( sql, (err, data) => {
        if (err) {
            return res.json("error");
        }
        else{
            //console.log(data);
            return res.json(data);
        }
    });
});

app.get("/user/:id", (req, res) => {
    const id=req.params.id;
    const sql = "SELECT * FROM user WHERE user_id=? ";
    db.query(sql,[id] ,(err, data) => {
        if (err) {
            return res.json("Error");
        } else {
            return res.json(data);
        }
    });
});
///////
app.get("/user_training/:id", (req, res) => {
    const id=req.params.id;
    const sql = "SELECT * FROM training WHERE id=? ";
    db.query(sql,[id] ,(err, data) => {
        if (err) {
            return res.json("Error");
        } else {
            return res.json(data);
        }
    });
});


app.put('/Update_User_training/:id', (req, res) => {
    const sql = "UPDATE training SET `Training_name` =? , `Training_state` =? WHERE id =? ";
    const values =[
        req.body.Training_name,
        req.body.Training_state
    ]
    const id=req.params.id;
    db.query(sql,[...values,id], (err, data) => {
        if (err) {
            console.log(err);
            return res.json("ErrorTT");
        }
        return res.json(data);
    });
});


/////////////////
app.put('/update/:id', (req, res) => {
    const sql = "UPDATE user SET `Name` =? , `Email` =? ,`Password` =? ,`Phone` =? ,`Status` =? ,`Type` =? ,`Team_id`=?  WHERE user_id =? ";
    const values =[
        req.body.Name,
        req.body.Email,
        req.body.Password,
        req.body.Phone,
        req.body.Status,
        req.body.Type,
        req.body.Team_id
    ]
    const id=req.params.id;
    db.query(sql,[...values,id], (err, data) => {
        if (err) {
            console.log(err);
            return res.json("Error");
        }
        return res.json(data);
    });
});



app.get('/login/:Email/:Password',(req, res)=>{
    //console.log(res.params);
    const sql="SELECT * FROM user WHERE `Email` = ? AND `Password` = ? ";
    const email=req.params.Email;
    const pass=req.params.Password;
    db.query( sql,[email,pass], (err, data) => {
        if (err) {
            return res.json("error");
        }
        else{
            res.json(data);
        }
    });
});
app.post('/Add_User', (req, res) => {
    const checkEmailSql = "SELECT * FROM user WHERE `email` = ?";
    const insertUserSql = "INSERT INTO user (name, email, password, phone, status, type,Team_id) VALUES (?, ?, ?, ?, ?, ?,?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.phone,
        req.body.status,
        req.body.type,
        req.body.Team_id
    ];

    // First, check if email already exists in database
    db.query(checkEmailSql, [req.body.email], (err, result) => {
        if (err) {
            console.log(err);
            return res.json("Error");
        } else if (result.length > 0) {
            // Email already exists, return error message
            return res.json("Email already exists");
        } else {
            // Email does not exist, insert new user data
            db.query(insertUserSql, values, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.json("Error");
                } else {
                    console.log(result);
                    return res.json("User created successfully");
                }
            });
        }
    });
});


app.post('/Add_skill', (req, res) => {
    const insertUserSql = "INSERT INTO training (Training_name, Training_state,Emp_id) VALUES (?, ?,?)";
    const values = [
        req.body.Training_name,
        req.body.Training_state,
        req.body.Emp_id
    ];
    db.query(insertUserSql,values, (err, result) => {
        if (err) {
            console.log(err);
            return res.json("Error");
        } else if (result.length > 0) {
            
            return res.json("DONE");
        
        }
    });
});


app.delete('/delete_user/:id', (req, res) => {
    const sql = "DELETE FROM user WHERE user_id =? ";
    const id=req.params.id;
    db.query(sql,[id], (err, data) => {
        if (err) {
            console.log(err);
            return res.json("Error");
        }
        return res.json(data);
    });
});


app.delete('/delete_skill/:id', (req, res) => {
    const sql = "DELETE FROM training WHERE Emp_id =? ";
    const id=req.params.id;
    db.query(sql,[id], (err, data) => {
        if (err) {
            console.log(err);
            return res.json("Error");
        }
        return res.json(data);
    });
});

app.listen(4000, () => {
    console.log("listening on port 4000");
});
