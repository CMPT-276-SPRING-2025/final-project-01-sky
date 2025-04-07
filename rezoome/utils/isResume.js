
function isValidResume(resume) {
    // this makes sure a name exist and isnt an empty string
    if (
      !resume ||
      typeof resume !== "object" ||
      typeof resume.name !== "string" ||
      !resume.name.trim()
    ) {
      return false;
    }
  
    // normalize data so it doesn't crash if fields are missing or invalid
    const education = Array.isArray(resume.education) ? resume.education : [];
    const workExperience = Array.isArray(resume.workExperience) ? resume.workExperience : [];
    const skills = Array.isArray(resume.skills)
      ? resume.skills.filter(skill => typeof skill === "string" && skill.trim() !== "")
      : [];
  
    // valid if ther is at least one of these sections filled out with the name
    return (
      education.length > 0 ||
      workExperience.length > 0 ||
      skills.length > 0
    );
  }
  
  module.exports = { isValidResume };
  