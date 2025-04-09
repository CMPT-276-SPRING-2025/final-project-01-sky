function isValidResume(resume) {
  // check if resume is missing, not an object, or missing a valid name
  if (
    !resume || // null or undefined
    typeof resume !== "object" || // must be an object
    typeof resume.name !== "string" || // name must be a string
    !resume.name.trim() // name can't be empty or just whitespace
  ) {
    return false;
  }

  // normalize data to ensure it's safe to work with
  // if fields are not arrays, default to empty arrays to avoid errors
  const education = Array.isArray(resume.education) ? resume.education : [];
  const workExperience = Array.isArray(resume.workExperience) ? resume.workExperience : [];

  // skills should be an array of non-empty strings
  const skills = Array.isArray(resume.skills)
    ? resume.skills.filter(skill => typeof skill === "string" && skill.trim() !== "")
    : [];

  // the resume is valid if it has a name and at least one non-empty section
  return (
    education.length > 0 ||
    workExperience.length > 0 ||
    skills.length > 0
  );
}

// export the function so it can be used for validation or tested
module.exports = { isValidResume };
