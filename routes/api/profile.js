const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Validation
const validateProfileInput = require('../../validation/profile')
const validateExperienceInput = require('../../validation/experience')
const validateEducationInput = require('../../validation/education')

// Load profile
const Profile = require('../../models/Profile');
//Load User Model
const User = require('../../models/User');

router.get('/test', (req, res) => res.json({msg: "Profile Works"}));

// @route       GET to api/profile
// @description get current users profile
// @access      Private
router.get('/', passport.authenticate('jwt', { session: false}), (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })
  .populate('user', ['name', 'avatar'])
  .then(profile => {
    if(!profile){
      errors.noprofile = 'There is no profile for this user'
      return res.status(404).json(errors)
    }
    res.json(profile)
  })
  .catch(err => res.status(404).json(err));
  }
);

// @route       GET api/profile/all
// @description Get all profiles
// @access      Public

router.get('/all', (req,res) => {
  const errors = {};

  Profile.find()
  .populate('user', ['name', 'avatar'])
  .then(profiles => {
    if(!profiles) { //if no profiles are found
      errors.noprofile = 'There are no profiles'; // add error into error object
      return res.status(404).json(errors)
    }
    res.json(profiles) // shoe all profiles
  })
  .catch(err => res.status(404).json({ profile: 'There are no profiles'})
    );
})


// @route       GET api/profile/handle/:handle
// @description Get profile by handle
// @access      Public

router.get('/handle/:handle', (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
  .populate('user', ['name', 'avatar'])
  .then(profile => {
    if(!profile) {
      errors.noprofile = 'There is no profile for this user';
      res.status(404).json(errors)
    }

    res.json(profile)
  })
  .catch(err => res.status(404).json(err));
});

// @route       GET api/profile/user/:user_id
// @description Get profile by user ID
// @access      Public

router.get('/user/:user_id', (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.user_id })
  .populate('user', ['name', 'avatar'])
  .then(profile => {
    if(!profile) {
      errors.noprofile = 'There is no profile for this user';
      res.status(404).json(errors)
    }

    res.json(profile)
  })
  .catch(err => res.status(404).json(err));
});




// @route       POST to api/profile
// @description Create user profile
// @access      Private
router.post('/', passport.authenticate('jwt', { session: false}), (req, res) => {

  const { errors, isValid } = validateProfileInput(req.body); //destructuring
  // Check validation
  if(!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors)
  }
  // Get fields
  const profileFields = {};
  // FIll the profile fields
  profileFields.user = req.user.id;
  if(req.body.handle) profileFields.handle = req.body.handle.toLowerCase();
  if(req.body.company) profileFields.company = req.body.company;
  if(req.body.website) profileFields.website = req.body.website;
  if(req.body.location) profileFields.location = req.body.location;
  if(req.body.bio) profileFields.bio = req.body.bio;
  if(req.body.status) profileFields.status = req.body.status;
  if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
  // Skills - Split into array
  if(typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',');
  }

  // if(typeof req.body.workouts !== 'undefined') {
  //   profileFields.workouts = req.body.workouts.split(',');
  // }

  // Social
  profileFields.social = {};

  // FIll the profile fields for social
  if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

  Profile.findOne({ user: req.user.id }) // Search for user by login ID
  .then(profile => {
    if(profile){ //update if profile exists
      Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true },
      // { useFindAndModify: false}
      ).then(profile => res.json(profile))
    } else {
      //Create

      //Check if handle exists
      Profile.findOne({ handle: profileFields.handle.toLowerCase() }).then(profile => {
        if(profile) {
        errors.handle = 'That handle already exists';
        res.status(400).json(errors);
         }


      // Save Profile if handle doesn't already exist
      new Profile(profileFields).save().then(profile => res.json(profile));
      });
    }
  })
  }
);

// @route       POST api/profile/experience
// @description Add experience to profile
// @access      Private
router.post('/experience', passport.authenticate('jwt', { session: false}), (req, res) => {
  const { errors, isValid } = validateExperienceInput(req.body); //destructuring

  // Check validation
  if(!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors)
  }

  Profile.findOne({ user: req.user.id })
  .then(profile => {
    const newExp = {
      // _id: mongoose.Types.ObjectId(),
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    }

    //Add to experience array
    profile.experience.unshift(newExp);

    profile.save().then( profile => res.json(profile))
  })
});


//@route POST api/profile/education
//@desc ADD education to profile
//@access Private
router.post(
  '/education',
  passport.authenticate('jwt', { session: false}),
  (req ,res) => {
    const { errors, isValid } = validateEducationInput(req.body); //destructuring
    // Check validation
    if(!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors)
    }

  Profile.findOne({ user: req.user.id })
  .then(profile => {
    const newEdu = {
      // _id: mongoose.Types.ObjectId(),
      school: req.body.school,
      degree: req.body.degree,
      fieldofstudy: req.body.fieldofstudy,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    }

    //Add to education array
    profile.education.unshift(newEdu);

    profile.save().then(profile => res.json(profile))
    })
  }
);

//@route Delete api/profile/experience/:exp_id
//@desc Deleye education to profile
//@access Private
router.delete(
  '/experience/:exp_id',
  passport.authenticate('jwt', { session: false}),
  (req ,res) => {

  Profile.findOne({ user: req.user.id }).then(profile => {
        // Get index to remove
        const indexToRemove = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        //splice experience out of array
        profile.experience.splice(indexToRemove, 1);
        //save
        profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.status(400).json());
  }
);

//@route Delete api/profile/education/:edu_id
//@desc Deleye education to profile
//@access Private
router.delete(
  '/education/:edu_id',
  passport.authenticate('jwt', { session: false}),
  (req ,res) => {

  Profile.findOne({ user: req.user.id }).then(profile => {
        // Get index to remove
        const indexToRemove = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        //splice education out of array
        profile.education.splice(indexToRemove, 1);
        //save
        profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.status(400).json(console.log(err)));
  }
);


//@route Delete api/profile
//@desc Deleye education to profile
//@access Private
router.delete(
  '/',
  passport.authenticate('jwt', { session: false}),
  (req ,res) => {
    Profile.findOneAndRemove({ user: req.user.id})
    .then(() => {
      User.findOneAndRemove({ _id: req.user.id })
      .then(() => res.json({ success: true }));
    })
    .catch(err => res.status(400).json());
  }
);


module.exports = router;
