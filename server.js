const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require('ejs');
const session = require('express-session');
const { kStringMaxLength } = require('buffer');

app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false  
  }));

  let login = null;
  let gymtablelist;
  let gymlist;
  let userslist;
  let historyslist;
  let bookslist;

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/allforall_db")

// create data schema
const announcementSchema = {
    title: String,
    content: String
}

const UserSchema = {
    name: String,
    password: String,
    email: String,
    phone: String,
    address: String,
    country: String,
    username: String,
    lastname: String,
    cancellations: Number,
    status: String,
    role: String
}

const gymtableSchema = {
    ex: String,
    time: String,
    day: String,
    user: String
}

const gymSchema = {
    ex: String,
    trainer: String,
    category: String
}

const bookSchema = {
    ex: String,
    day: String,
    time: String,
    user: String,
    status: String
}

const Announcement = mongoose.model("Announcements", announcementSchema);
const User = mongoose.model("Users", UserSchema);
const Gymtable = mongoose.model("Gymtable", gymtableSchema);
const Gym = mongoose.model("Gym", gymSchema);
const Book = mongoose.model("Booked", bookSchema);

const date = new Date();

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const currentDayOfWeek = daysOfWeek[date.getDay()];
// const currentDayOfWeek = "Saturday";

// Gym.find().then((gym) => {
//     // gymTables contains array of all GymTable docs
//     gymlist = gym;
// });

app.get('/announcements', (req, res) => {
    Announcement.find().then((announcements)=> {
        res.render('announcements', {
            announcementsList: announcements,
            login: req.session.login
        })
    })
})




app.get('/', async (req, res) => {
    const timeSlots = [
        { time: '9:00', booked: false },
        { time: '9:30', booked: true },
        { time: '10:00', booked: false },
        { time: '10:30', booked: false },
        { time: '11:00', booked: false },
    ];

    const gymtable = await Gymtable.find();
    gymtablelist = gymtable;

    const gyms = await Gym.find();
    gymlist = gyms;

    // console.log(gymlist);

    // console.log(gymtablelist);

    // console.log(userslist);

    // console.log(currentDayOfWeek);

    res.render('mainpage', { login: req.session.login, timeSlots: timeSlots, gymtablelist: gymtablelist, gymlist: gymlist })
})




app.post('/book', (req, res) => {

    const time = req.body.time;
    const day = req.body.day;
    const ex = req.body.service;
    const email = req.session.email;
    const user = "";

    const currentnumday = dayToNumber(currentDayOfWeek);

    Gymtable.findOne({ ex: ex, time: time, day: day }).then((gymtable) => {
        if (gymtable) {

            User.findOne({ email:email}).then((user) => {

                inttime = timeToInt(time);

                // && inttime >= getCurrentHour() && currentnumday <= dayToNumber(gymtable.day)  && inttime >= getCurrentHour()

                if (gymtable.user === "" && user.cancellations<2 ) {
                    // console.log("ok1");

                    Gymtable.updateOne({ _id: gymtable._id }, {
                        $set: {
                            user: email
                        }
                    }).then(() => {
                        let newBook = new Book({
                            ex: ex,
                            day: day,
                            time: time,
                            user: email,
                            status: "ongoing"
                        });
                        newBook.save();
                        console.log("Gymtable updated");
                        res.redirect('/');
                    });

                } else {
                    // console.log("ok2");
                    res.redirect('/');
                    // res.send(<script>alert('That time slot is already booked');window.location='/signup';</script>);
                } 
            });
        } else {
            // console.log("ok3");
            res.redirect('/');
            // res.send(<script>alert('That time slot is already booked');window.location='/signup';</script>);
        }
    });


});

app.get('/history', async (req, res) => {

    const timeSlots = [
        { time: '9:00', booked: false },
        { time: '9:30', booked: true },
        { time: '10:00', booked: false },
        { time: '10:30', booked: false },
        { time: '11:00', booked: false },
    ];

    const gyms = await Gym.find();
        gymlist = gyms;

    const books = await Book.find();
    bookslist = books;

    res.render('history', { bookslist: bookslist, login: req.session.login, email: req.session.email, timeSlots: timeSlots, gymlist: gymlist })
});



app.post('/cancelbooking', (req, res) => {

    const time = req.body.time;
    const day = req.body.day;
    const ex = req.body.service;
    const email = req.session.email;

    Book.findOne({ ex: ex, time: time, day: day }).then((booked) => {

        if(booked){
            inttimegym = timeToInt(booked.time);
            inttime = timeToInt(time);

            if(inttimegym <= inttime+2 && booked.status == "ongoing"){
                Book.deleteOne({ ex: ex, time: time, day: day }).then(function(){
                    console.log("Data deleted"); // Success
                }).catch(function(error){
                    console.log(error); // Failure
                });
                Gymtable.findOne({ ex: ex, time: time, day: day }).then((gymtable) => {
                    Gymtable.updateOne({ _id: gymtable._id }, {
                        $set: {
                            user: ""
                        }
                    }).then(() => {
                        res.redirect('/');
                    });
                });
            }else{
                res.redirect('/');
            }
        }else{
            res.redirect('/'); 
        }

    });

    // res.redirect('/');

});




app.get('/signup', (req, res) => {
    res.render('sign-up')
})

app.post('/signup', (req, res) => {
    let newUser = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        phone: req.body.phone,
        lastname: req.body.lastname,
        name: req.body.name,
        country: req.body.country,
        address: req.body.address,
        cancellations: 0,
        status: "pending",
        role: "user"
    });
    const email = req.body.email;
    User.findOne({ email: email }).then((user) => {
        if (user) {
            res.send(`<script>alert('Email is already taken');window.location='/signup';</script>`);
        }
        else {
            newUser.save();
            res.redirect("/signin");
        }
    })

})


app.get('/signin', (req, res) => {
    res.render('sign-in')
})

app.post('/signin', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email, password: password }).then((user) => {

        if (user && user.status == "accepted" && user.role == "user") {
            req.session.login = true;
            req.session.role = user.role;
            req.session.email = email;
            res.redirect("/");
        } else if (user && user.role == "admin") {
            req.session.email = email;
            req.session.role = user.role;
            res.redirect("/admin_announ");
        }
        else {
            res.send(`<script>alert('Failed Sign-In');window.location='/signin';</script>`);  
        }

    })
}) 



//ADMIN REQUESTS
app.get('/admin_req', (req, res) => {
    
    User.find().then((users)=> {
        res.render('admin_requests', {
            usersList: users,
            email: req.session.email,
            role: req.session.role
        })
    })
})


app.post('/checking_req', (req, res) => {

    const email = req.body.email;
    const status = req.body.status;
    const check = req.body.c;

    if (check == "approve") {
        User.updateOne({ email: email }, {
            $set: {
                status: "accepted"
            }
        }).then(() => {
            res.redirect("/admin_req");
        });
    } else if (check == "decline") {
        User.updateOne({ email: email }, {
            $set: {
                status: "rejected"
            }
        }).then(() => {
            res.redirect("/admin_req");
        });
    }
   
});

//ADMIN USERS MANAGMENT
app.get('/admin_users', (req, res) => {

    User.find().then((users)=> {
        res.render('admin_users', {
            usersList: users,
            email: req.session.email,
            role: req.session.role
        })
    })
})



//ADMIN USERS UPDATE
app.post('/update_users', (req, res) => {

    const email = req.body.email;
    User.findOne({ email: email }).then((user) => {
        console.log("ok!");
        if (user) {
            console.log("ok2!");
            User.updateOne({ email: email }, {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    phone: req.body.phone,
                    lastname: req.body.lastname,
                    name: req.body.name,
                    country: req.body.country,
                    address: req.body.address,
                    cancellations: req.body.cancellations,
                    role: req.body.role
                }
            }).then(() => {
                res.redirect("/admin_users");
            });
            
            
        }
        else {
            res.send(`<script>alert('Email does not exist. Try again.');window.location='/admin_users';</script>`);
        }
    })
    
})


//delete user

app.post('/delete_user', (req, res) => {

    const email = req.body.email;
    User.findOne({ email: email }).then((user) => {
        if (user) {
            User.deleteOne({ email: email }).then(() => {
                res.redirect("/admin_users");
            });
        }
        else {
            res.send(`<script>alert('Email does not exist. Try again.');window.location='/admin_users';</script>`);
        }
    })
})




//admin trainning
app.get('/admin_trainning', (req, res) => {

    Gym.find().then((gyms)=> {
        res.render('admin_trainning', {
            gymList: gyms,
            email: req.session.email,
            role: req.session.role
        })
    })
})

//update trainning
app.post('/update_trainning', (req, res) => {

    const exersice = req.body.exersice;
    const trainer = req.body.trainer;
    const category = req.body.category;
    
    Gym.findOne({ ex: exersice }).then((gym) => {
        if (gym) {
            Gym.updateOne({ ex: exersice }, {
                $set: {
                    trainer: trainer,
                    category: category
                }
            }).then(() => {
                res.redirect("/admin_trainning");
            });
        }
        else {
            res.send(`<script>alert('Exersice is not available. Try again.');window.location='/admin_trainning';</script>`);
        }
    })
    
})

//delete trainning
app.post('/delete_trainning', (req, res) => {

    const exersice = req.body.exersice;
    
    Gym.findOne({ ex: exersice }).then((gym) => {
        if (gym) {
            Gym.deleteOne({ ex: exersice }).then(() => {
                Gymtable.deleteMany({ ex: exersice }).then(() => {
                    res.redirect("/admin_trainning");
                });
            });
        }
        else {
            res.send(`<script>alert('Exersice is not available. Try again.');window.location='/admin_trainning';</script>`);
        }
    })
    
})

//create a new exersice
app.post('/add_trainning', (req, res) => {
    const exersice = req.body.exersice;
    const trainer = req.body.trainer;
    const category = req.body.category;

    Gym.findOne({ exersice: exersice }).then((gym) => {
        if (gym) {
            res.send(`<script>alert('Exersice is already taken');window.location='/admin_trainning';</script>`);
        }
        else {
            let newGym = new Gym({
                ex: exersice,
                trainer: trainer,
                category: category
            });
            newGym.save();
            res.redirect("/admin_trainning");
        }
    })
})



app.get('/admin_program', async (req, res) => {

    const gyms = await Gym.find();
    gymlist = gyms;

    const timeSlots = [
        { time: '9:00', booked: false },
        { time: '9:30', booked: true },
        { time: '10:00', booked: false },
        { time: '10:30', booked: false },
        { time: '11:00', booked: false },
    ];

    Gymtable.find().then((gymTable)=> {
        res.render('admin_program', {
            gymtablelist: gymTable,
            email: req.session.email,
            role: req.session.role,
            timeSlots: timeSlots,
            gymlist: gymlist
        })
    })
})


app.post('/create_table', (req, res) => {

    const time = req.body.time;
    const day = req.body.day;
    const ex = req.body.exersice;
    const email = req.session.email;
    const user = "";

    Gymtable.findOne({ time: time, day: day }).then((gymtable) => {

        if (gymtable) {
            res.send(`<script>alert('Table is already taken');window.location='/admin_program';</script>`);
        }
        else {
            let newGymtable = new Gymtable({
                ex: ex,
                time: time,
                day: day,
                user: user
            });
            newGymtable.save();
            res.redirect("/admin_program");
        }
    })
})

app.post('/delete_table', (req, res) => {

    const id = req.body.id;

    Gymtable.findOne({ _id: id}).then((gymtable) => {
        if (gymtable) {
            Gymtable.deleteOne({ _id: id}).then(() => {
                res.redirect("/admin_program");
            });
        }
        else {
            res.send(`<script>alert('Table is not available. Try again.');window.location='/admin_program';</script>`);
        }
    })
})

// ANNOUNCEMENTS
app.get('/admin_announ', (req, res) => {
    console.log(req.session.email);
    Announcement.find().then((announcements)=> {
        res.render('admin_announcements', {
            announcementsList: announcements,
            email: req.session.email,
            role: req.session.role
        })
    })

});

app.post('/publish', (req, res) => {
    const title = req.body.title;
    const announcements = req.body.announcements;
    let newannouncement = new Announcement({
        title: title,
        content: announcements
    });

    newannouncement.save();
    res.redirect("/admin_announ");
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    login = null;
    // res.redirect("/");
    res.send(`<script>alert('You Loged-Out');window.location='/signin';</script>`);
  });

let hasRunReset = false;

async function resetCancellations() {

    if(currentDayOfWeek === 'Saturday' && !hasRunReset) {

    const users = await User.find();
    
    for(let user of users) {
        await User.updateOne({_id: user._id}, {
        $set: {
            cancellations: 0
        }  
        });
    }

        hasRunReset = true;

    } else {
        hasRunReset = false; 

    }

}

async function resetBookings() {

    if(currentDayOfWeek === 'Saturday' && !hasRunReset) {

        // console.log("resetting bookings");

        const bookings = await Gymtable.find();

        // console.log(bookings);

        for(let booking of bookings) {
        await Gymtable.updateOne({_id: booking._id}, {
            $set: {
                user: ""
            }
        });
        }

        hasRunReset = true;

    } else {
        hasRunReset = false; 

    }

}

function dayToNumber(day) {
    switch (day) {
        case 'Monday':
            return 1;
        case 'Tuesday':
            return 2;
        case 'Wednesday':
            return 3;
        case 'Thursday':
            return 4;
        case 'Friday':
            return 5;
        case 'Saturday':
            return 0;
        case 'Sunday':
            return 0;
        default:
            return null;
    }
}

function getCurrentHour() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return hours + minutes/100;
}


function timeToInt(time) {
    const [hours, minutes] = time.split(':');
    return parseInt(hours) + parseInt(minutes)/100;
}

console.log(getCurrentHour());


resetBookings();

resetCancellations();

app.listen(3000, function(){

    console.log("server is running on port 3000")

})