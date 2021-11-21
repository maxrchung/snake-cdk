import * as cdk from '@aws-cdk/core';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as amplify from '@aws-cdk/aws-amplify';

export class SnakeCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const amplifyApp = new amplify.App(this, 'snake', {
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: 'maxrchung',
        repository: 'snake',
        oauthToken: cdk.SecretValue.plainText(process.env.PERSONAL_ACCESS_TOKEN || "")
      }),
      buildSpec: codebuild.BuildSpec.fromObjectToYaml({ // Alternatively add a `amplify.yml` to the repo
        version: '1.0',
        frontend: {
          phases: {
            preBuild: {
              commands: [
                // Some packages are failing to install because amplify's default node version is too old
                'nvm install 12',
                'yarn'
              ]
            },
            build: {
              commands: [
                'yarn build'
              ]
            }
          },
          artifacts: {
            baseDirectory: 'public',
            files: [
              '**/*'
            ]
          },
          cache: {
            paths: [
              'node_modules/**/*'
            ]
          }
        }
      })
    });
    amplifyApp.addBranch('main');
  }
}
