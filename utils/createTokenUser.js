const createTokenUser = (user, userAgent) => {
  return { 
    user: {
      name: user.name,
      userId: user._id,
      role: user.role
    },
    userAgent 
  };
};

module.exports = createTokenUser;