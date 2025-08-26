import { Octokit } from "@octokit/rest";
import dotenv from 'dotenv'
import '@dotenvx/dotenvx/config'

dotenv.config({ path: './.env' });
const token = process.env.GITHUB_TOKEN;


// access octokit
export const octokit = new Octokit({
    auth: token,
});