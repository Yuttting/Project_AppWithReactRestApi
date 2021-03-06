const express = require('express');
const router = express.Router();
const User = require('./models').User;
const Course = require('./models').Course;

const { check, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');


/**
 * Middleware to authenticate the request using Basic Authentication.
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @param {Function} next - The function to call to pass execution to the next middleware.
 */
const authenticateUser = async (req, res, next) => {

    // users arrray
    const users = await User.findAll();

    let message = null;
  
    // Get the user's credentials from the Authorization header.
    const credentials = auth(req);
  
    if (credentials) {
      // Look for a user whose `emailAddress` matches the credentials `name` property.
      const userObj = await users.find(u => u.dataValues.emailAddress === credentials.name);
      
      //const user = user.find({emailAddress: credentials.name});
  
      if (userObj) {
        const user = userObj.dataValues;

        //compare unhashed password
        let authenticated
        authenticated = bcryptjs.compareSync(credentials.pass, user.password);

        // If fail, the password might already be hashed. So compare hashed passwords
        if (!authenticated){
          if(credentials.pass === user.password) {
            authenticated = true
          } 
        }

        if (authenticated) {
          // Store the user on the Request object.
          req.currentUser = user;
          console.log(`Authentication successful for user: ${user.firstName} ${user.lastName}`);
        } else {
          message = `Authentication failure for user: ${user.firstName} ${user.lastName}`;
        }
      } else {
        console.log(credentials)
        message = `User not found for user: ${credentials.name}`;
      }
    } else {
      message = 'Auth header not found';
    }
  
    if (message) {
      console.warn(message);
      res.status(401).json({ message: 'Access Denied' });
    } else {
      next();
    }

};

function asyncHandler(cb) {
  return async (req, res, next) => {
      try {
          await cb(req, res, next);
      } catch(err) {
          next(err);
      }
  }
}

//GET /api/users 200 - Returns the currently authenticated user
router.get('/users',[
  check('emailAddress')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "emailAddress"'),
  check('password')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "password"'),
], authenticateUser, asyncHandler(async(req, res) => {
    const user = req.currentUser;

    res.json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        password: user.password
    });
    
}));

//POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/users', [
    check('firstName')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Please provide a value for "firstName"'),
    check('lastName')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Please provide a value for "lastName"'),
    check('emailAddress')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Please provide a value for "emailAddress"')
        .isEmail()
        .withMessage('Please provide a valid "emailAddress"')
        .custom(value => {
          return User.findOne({where:{emailAddress: value}}).then(user => {
            if (user) {
              return Promise.reject('E-mail already in use');
            }
          });
        }),
    check('password')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Please provide a value for "password"'),
  ], asyncHandler(async (req, res) => {
    // Attempt to get the validation result from the Request object.
    const errors = validationResult(req);
  
    // If there are validation errors...
    if (!errors.isEmpty()) {
      // Use the Array `map()` method to get a list of error messages.
      const errorMessages = errors.array().map(error => error.msg);
  
      // Return the validation errors to the client.
      return res.status(400).json({ errors: errorMessages });
    }
  
    // Get the user from the request body.
    let user = req.body;
  
    // Hash the new user's password.
    //var salt = bcrypt.genSaltSync(10);
    user.password = bcryptjs.hashSync(user.password);
  
    // Add the user to the `users` database.
    user = await User.create(user);
     
    // Set the status to 201 Created and end the response.
    return res.status(201).location('/').end();
  }));
  

// GET /api/courses 200 - Returns a list of courses (including the user that owns each course)
router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      attributes: {exclude: ['createdAt', 'updatedAt']},
      include: [
        {
          model: User,
          //as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'emailAddress']
        },
      ],
    });
    res.status(200).json(courses);
}));

// GET /api/courses/:id 200 - Returns a the course (including the user that owns the course) for the provided course ID
router.get('/courses/:id', asyncHandler(async(req, res, next) => {
    const course = await Course.findByPk(req.params.id, {
      attributes: {exclude: ['createdAt', 'updatedAt']},
      include: [
        {
          model: User,
          //as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'emailAddress']
        },
      ],
    });
    if(course) {
      res.json(course);
    } else {
      res.status(404).json({message: 'The course does not exist.'});
    }
    
}));

// POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content
router.post('/courses', [
  check('title')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "title"'),
  check('description')
    .exists({checkNull: true, checkFalsy: true})
    .withMessage('Please provide a value for "description"')
], authenticateUser, asyncHandler(async(req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }
  
  const course = await Course.create(req.body);
  const id = course.id;
  res.status(201).location(`/courses/${id}`).end();
}));

// PUT /api/courses/:id 204 - Updates a course and returns no content
router.put('/courses/:id', [
  check('title')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "title"'),
  check('description')
    .exists({checkNull: true, checkFalsy: true})
    .withMessage('Please provide a value for "description"')
], authenticateUser, asyncHandler(async(req, res) => {
  
  
  const course = await Course.findByPk(req.params.id);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }
  
  if(course) {
    if(course.userId == req.currentUser.id) {
      await course.update(req.body);
      res.status(204).end();
    } else {
      res.status(403).json({ message: 'Only the creator of the course can update it.' });
    }
  } else {
    res.status(404).json({message: 'The course does not exist.'});
  }
  
}));

// DELETE /api/courses/:id 204 - Deletes a course and returns no content
router.delete('/courses/:id', authenticateUser, asyncHandler(async(req, res, next) => {
  const course = await Course.findByPk(req.params.id);
  if(course) {
    if(course.userId == req.currentUser.id) {
      await course.destroy(req.body);
      res.status(204).end();
    } else {
      res.status(403).json({ message: 'Only the creator of the course can delete it.' });
    }
  } else {
    res.status(404).json({message: 'The course does not exist.'});
  }
  
}));

module.exports = router;
