import User from "../models/User.js";
import bcrypt from "bcrypt";

// READ
export const getUser = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ _id: id });
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
export const getUsers = async(req, res) => {
    try {
        const user = await User.find();
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
export const getUserIdEmail = async(req, res) => {
    const userId = req.query.userId;
    const email = req.query.email;
    try {
        const user = userId ?
            await User.findById(userId) :
            await User.findOne({ email: email });
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const getFollowers = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        const followers = await Promise.all(
            user.followers.map((id) => User.findById(id))
        );
        const formattedFollowers = followers.map(
            ({ _id, firstName, lastName, picturePath }) => {
                return { _id, firstName, lastName, picturePath };
            }
        );

        res.status(200).json(formattedFollowers);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
export const getFollowings = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        const followings = await Promise.all(
            user.following.map((id) => User.findById(id))
        );
        const formattedFollowings = followings.map(
            ({ _id, firstName, lastName, picturePath }) => {
                return { _id, firstName, lastName, picturePath };
            }
        );

        res.status(200).json(formattedFollowings);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
// UPDATE
export const follow = async(req, res) => {
    try {
        const { id, followedId } = req.params;
        const user = await User.findById(id);
        const followed = await User.findById(followedId);

        if (user.following.includes(followedId)) {
            user.following = user.following.filter((id) => id !== followedId);
            followed.followers = followed.followers.filter((id) => id !== id);
        } else {
            user.following.push(followedId);
            followed.followers.push(id);
        }
        await user.save();
        await followed.save();

        const followers = await Promise.all(
            user.followers.map((id) => User.findById(id))
        );
        const formattedFollowers = followers.map(
            ({ _id, firstName, lastName, picturePath }) => {
                return { _id, firstName, lastName, picturePath };
            }
        );

        res.status(200).json(formattedFollowers);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
export const updateUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const {
        firstName,
        lastName,
        phone,
        UserType,
        password,
        passwordVerification,
        address,
        profilePicture,
      } = req.body;
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ msg: 'User not found' });
  
      // Only update fields that were actually sent
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (phone) user.phone = phone;
      if (address) user.address = address;
      if (profilePicture) user.profilePicture = profilePicture;
  
      // Update UserType if it was sent
      if (UserType) {
        user.UserType = JSON.parse(UserType);
      }
  
      // Update password if it was sent
      if (password && passwordVerification) {
        if (password !== passwordVerification) {
          return res.status(400).json({ msg: 'Passwords do not match' });
        }
  
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(password, salt);
      }
  
      const savedUser = await user.save();
      res.status(200).json(savedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  

  
