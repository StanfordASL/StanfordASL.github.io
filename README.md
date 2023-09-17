# StanfordASL
The ASL's website, hosted on GitHub Pages!

## System Setup
Before developing/publishing the website, you may need to install various system dependencies, specifically `rake` (a build automation tool) and `bundler` (a Ruby dependency manager, which will install all further dependencies listed in [`Gemfile`](Gemfile)). On a Ubuntu system, installing these dependencies looks something like
```sh
sudo apt install rake ruby-dev
sudo gem install bundler
```
And then `cd` into where you cloned this repository and run the following to install website 
dependencies with bundler
```sh
bundle config set --local path 'vendor/bundle'
bundle install
```

## Local Developement
To preview the website on your local machine, run
```sh
rake preview
```
To build locally, run
```sh
rake build  # this run the same build command as the Github action server
```
Normally you shouldn't need to perform local build, but in case you get CI errors on Github,
this would be useful for debugging any build errors.

## Publishing the Website
The `main` branch is protected, so you won't be able to push directly to it. This mechanism
is useful for preventing people from breaking the website silently, and fixing / reverting
broken commits for other people is no fun.

In order to
update the website content, you need to make changes in a seperate branch and create a pull
request. If you are unfamilier with the PR workflow, you can follow the steps below:

1. Create a new branch

    ```sh
    git checkout -b <branch_name>
    ```
    replacing `<branch_name>` with an actual branch name, e.g. `alvin/some_feature`.

2. Make changes to the website, and test run it with `rake preview`.

3. Commit your changes and push to the new branch

    ```sh
    git commit -m "added site x" && git push -u origin <branch_name>
    ```
    Note: modify the commit message to something related to your change

4. Create a PR from the
[Github project page](https://github.com/StanfordASL/StanfordASL.github.io/tree/alvin/ci)
following the prompt on the top of the page.

5. Go to the [PR page](https://github.com/StanfordASL/StanfordASL.github.io/pulls) and find your
PR. Wait for a few minutes for the CI checks to pass (there will be a ✅ on the bottom of the PR
page if all checks pass). Then you can press the merge button to deploy your changes. If the CI
checks did not pass, you can click into the failed checks to see what happened.

**NOTE**: This GitHub Pages link is where the `asl.stanford.edu` and `asl-origin.stanford.edu` proxies point to, so this repository and the corresponding GitHub Page is the "actual" website.
