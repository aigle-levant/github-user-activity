// libraries
import '@dotenvx/dotenvx/config'
import ora from 'ora';
import chalk from 'chalk';
// modules
import { getUserActivity, getUserRepos, getUserCommit } from "./commands.js";
import { octokit } from "./octokit.js";

// import spinner
const spinner = ora('Hacking into mainframes...').start();
setTimeout(() => {
    spinner.color = 'yellow';
    spinner.text = 'Enhancing...\n';

    console.log(`${chalk.bgBlueBright.bold("\nGitHub Activity!")}`);
    // get username
    const username = process.argv[2];
    const command = process.argv[3]?.toLowerCase();
    if (!username) {
        console.log(`\nProvide a valid ${chalk.bgGreenBright("GitHub username")}!`);
        process.exit(1);
    } else if (!command) {
        console.log(`\nProvide a valid ${chalk.bgGreenBright("command")}!`);
        console.log(`Commands:\n${chalk.bgMagentaBright("activity")}\n${chalk.bgMagentaBright("repos")}\n${chalk.bgMagentaBright("commits")}`);
        process.exit(1);
    } else {
        (async () => {
            let res;
            if (command === "activity") {
                res = await getUserActivity(username);
            } else if (command === "repos") {
                res = await getUserRepos(username);
            } else if (command === "commits") {
                res = await getUserCommit(username);
            } else {
                console.log(`\nProvide one of these ${chalk.bgGreenBright("commands")}!`);
                console.log(`Commands:\n${chalk.bgMagentaBright("activity")}\n${chalk.bgMagentaBright("repos")}\n${chalk.bgMagentaBright("commits")}`);
                process.exit(1);
            }
            console.log(res);
            spinner.stop();
        })();
    }
}, 3000);
