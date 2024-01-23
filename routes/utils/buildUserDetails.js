function buildUserDetails(user) {
  return {
    id: user._id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    displayName: user.displayName,
    fullName: `${user.firstName} ${user.lastName}`,
    enabled: user.enabled,
    hasInitialPassword: user.hasInitialPassword,
  };
}

module.exports = buildUserDetails;
