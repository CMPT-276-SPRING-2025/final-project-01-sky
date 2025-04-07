
function isValidResume(resume) {
    // this makes sure a name exist and isnt an empty string
    if (
        // if the resume is missing (meaning it is null or undefined)
      !resume ||
      // if its not ab object (say if its a string or number)
      typeof resume !== "object" ||
      // if the name is missing or not a string
      typeof resume.name !== "string" ||
      // if the name is just whitespace or empty
      !resume.name.trim()
    ) {
      return false;
    }
  
    // normalize data so it doesn't crash if fields are missing or invalid, makes sure they are treated as arrays
    // if they are not arrays, it will default to empty arrays
    const education = Array.isArray(resume.education) ? resume.education : [];
    const workExperience = Array.isArray(resume.workExperience) ? resume.workExperience : [];
    // skills should be an array of strings, filter out any invalid entries
    // it will filter out "" and "   " and any other invalid entries
    const skills = Array.isArray(resume.skills) 
      ? resume.skills.filter(skill => typeof skill === "string" && skill.trim() !== "")
      : [];
  
    // valid if there is at least one of these sections filled out with the name
    return (
      education.length > 0 ||
      workExperience.length > 0 ||
      skills.length > 0
    );
  }
  
  module.exports = { isValidResume };
  