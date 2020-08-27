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
        validate: validateTheResponse
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
        validate: validateTheResponse
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
        validate: validateTheResponse
    },
    {
        type: "input",
        message: "Enter your school/University",
        name: "school",
        validate: validateTheResponse
    }
]
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
const arrOfEmpl = [];
let moreEmp = true;

async function init() {
//while (moreEmp) {
    const newEmployeeType = await inquirer.prompt([
        {
            type: "list",
            message: "Select team member",
            name: "member",
            choices: ['Manager', 'Engineer', 'Intern']
        }
    ])

    console.log(newEmployeeType.member);

    await askMoreQuestions(newEmployeeType.member);

}

 function askMoreQuestions(member) {

    if (member === "Manager") {
        // ask manager related questions
        inquirer.prompt(mgrQuestions).then(answers => {
            if (Manager.count === 1) {
                console.log("There is already a manager, can't create more");
            } else {
                console.log(answers.name);
                console.log(answers.id);
                console.log(answers.email);
                console.log(answers.officeNumber);
                const newMgr = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
                arrOfEmpl.push(newMgr);
            }
            wantToContinue();
            //console.log(newMgr);
        });
    } else if (member === "Engineer") {
        // ask employee related questions
        inquirer.prompt(engQuestions).then(answers => {
            console.log(answers.name);
            console.log(answers.id);
            console.log(answers.email);
            console.log(answers.githubUserId);
            const newEng = new Engineer(answers.name, answers.id, answers.email, answers.githubUserId);
            arrOfEmpl.push(newEng);
            wantToContinue();
        });
    }
    else { // must be an Intern, so ask Intern related questions
        inquirer.prompt(internQuestions).then((answers) => {
            console.log(answers.name);
            console.log(answers.id);
            console.log(answers.email);
            console.log(answers.school);
            const newIntern = new Intern(answers.name, answers.id, answers.email, answers.school);
            arrOfEmpl.push(newIntern);
            wantToContinue();
        });
    }
}

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
        //console.log(response.moreEntries);
    })
}

function writeToFile(htmlContent) {

    if (!fs.existsSync(OUTPUT_DIR)) {
        console.log('Directory not found. Create one');
        fs.mkdirSync(OUTPUT_DIR);
    }

    fs.writeFileSync(outputPath, htmlContent, { encoding:'utf8', flag:'w' })

    // fs.writeFile(outputPath, htmlContent, err => {
    //     if (err) 
    //         return console.log("Could not write to file");
    //     console.log('Successful!');
    //   });

    // if (!fs.existsSync(dir)){
    //     fs.mkdirSync(dir);
    // }

    // try {
    //     writeToFile(outputPath, htmlContent);
    //     console.log("Successfull!");
    // } catch(err) {
    //     console.log(err);
    // }
}

init();