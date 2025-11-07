// // this a work around of explicite try catch blocks 
// .catch(next) means:

// If the Promise rejects with an error, call next(err)

// That is exactly what Express wants when handling errors in routes!

//  It's the same as writing:
// js

// func(req, res, next)
//   .then(() => {})          // do nothing on success
//   .catch(err => next(err)) // pass error to Express

module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}