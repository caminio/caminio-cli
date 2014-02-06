# caminio-cli

Command line interface for caminio. Helps scaffolding projects, gears, controllers, models and such stuff.

> Create a [caminio](https://github.com/caminio/caminio) project scaffold

## Installation

    $ npm install -g caminio-cli

This will install caminio globally. *Hint:* if you are on linux or mac, it might be an idea
to not pollute your global npm folder, but define a user specific folder int your `.npmrc`
file with:

    $ npm set prefix $HOME/.npm

## Usage

Create a *new project*

    $ caminio project <project-name>

Create a *new gear*

    $ caminio gear <gear-name>

Create a *new controller* inside an api-enabled gear/project

    [path/to/my_project] $ caminio controller <ControllerName>

Create a *new model* inside an api-enabled gear/prject

    [path/to/my_project] $ caminio controller <ControllerName>

## LICENSE

caminio-cli is licensed under the MIT license. See LICENSE for more details.
