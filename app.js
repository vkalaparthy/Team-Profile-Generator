const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { inherits } = require("util");

//const writeFileAsync = util.promisify(fs.writeFile);

const validateTheResponse = async (input) => {
    if (input === "") {
       return 'Incorrect response!!';
    }
    return true;
}

const validateEmailresponse = async (input) => {
    if (input === "") {
        return 'Incorrect email!!';
     } else  if (! /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input)) {
        return 'Incorrect email!!';
     }
     return true;
}

const mgrQuestions = [
    {
        type: "input",
        message: "Enter the name of the manager",
        name: "name",
        validate: validateTheResponse
    },
    {
        type: "input",
        message: "Enter id",
        name: "id",
        validate: validateTheResponse
    },
    {
        type: "input",
        message: "Enter email address",
        name: "email",
        validate: validateEmailresponse
    },
    {
        type: "input",
        message: "Enter Office number",
        name: "officeNumber",
        validate: validateTheResponse
    }
]

const engQuestions = [
    {
        type: "input",
        message: "Enter the name of the Engineer",
        name: "name",
        validate: validateTheResponse
    },
    {
        type: "input",
        message: "Enter id",
        name: "id",
        validate: validateTheResponse
    },
    {
        type: "input",
        message: "Enter email address",
        name: "email",
        validate: validateEmailresponse
    },
    {
        type: "input",
        message: "Enter user github user id",
        name: "githubUserId",
        validate: validateTheResponse
    }
]

const internQuestions = [
    {
        type: "input",
        message: "Enter the name of the Intern",
        name: "name",
        validate: validateTheResponse
    },
    {
        type: "input",
        message: "Enter id",
        name: "id",
        validate: validateTheResponse
    },
    {
        type: "input",
        message: "Enter email address",
        name: "email",
        validate: validateEmailresponse
    },
    {
        type: "input",
        message: "Enter your school/University",
        name: "school",
        validate: validateTheResponse
    }
]

const arrOfEmpl = [];

async function init() {
    const newEmployeeType = await inquirer.prompt([
        {
            type: "list",
            message: "Select team member",
            name: "member",
            choices: ['Manager', 'Engineer', 'Intern']
        }
    ])
    await askMoreQuestions(newEmployeeType.member);

}

// This is an async function to generate Objects based on role based on
// used provided information.
 async function askMoreQuestions(member) {

    if (member === "Manager") {
        // ask manager related questions
        if (Manager.count === 1) {
            console.log("There is already a manager, can't create more");
        } else {
            const answers = await inquirer.prompt(mgrQuestions);
            const newMgr = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
            arrOfEmpl.push(newMgr);
        }
        wantToContinue();
    } else if (member === "Engineer") {
        // ask employee related questions
        inquirer.prompt(engQuestions).then(answers => {
            const newEng = new Engineer(answers.name, answers.id, answers.email, answers.githubUserId);
            arrOfEmpl.push(newEng);
            wantToContinue();
        });
    }
    else { // must be an Intern, so ask Intern related questions
        inquirer.prompt(internQuestions).then((answers) => {
            const newIntern = new Intern(answers.name, answers.id, answers.email, answers.school);
            arrOfEmpl.push(newIntern);
            wantToContinue();
        });
    }
}

// This function is used to decide if user wants to create more employees for a team.
function wantToContinue() {
    inquirer.prompt ({
        type: 'confirm',
        message: "Do you want to continue?(Hit enter for yes)",
        name: 'moreEntries',
        default: true
    }). then (response => {
        if(response.moreEntries)
            init();
        else {
            const output = render(arrOfEmpl);
            writeToFile(output);
            //console.log(output)
        }
    })
}

// In this function, a team.html file is generated in output directory, with
// the information provided by the user.  Everytime app is run, a new team.html
// will be generated(rendered)
// If output directory does not exits, then it gets created.
function writeToFile(htmlContent) {

    if (!fs.existsSync(OUTPUT_DIR)) {
        //console.log('Directory not found. Create one');
        fs.mkdirSync(OUTPUT_DIR);
    }

    fs.writeFileSync(outputPath, htmlContent, { encoding:'utf8', flag:'w' })

}

init();