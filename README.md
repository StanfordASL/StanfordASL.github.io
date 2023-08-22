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

## Developing the Website
**High-level** commands include
```sh
rake preview # <- asks jekyll to build the site and host it locally 
```
**Low-level** commands include
```sh
rake check # <- checks whether the local repo is up to date
rake build # <- asks jekyll to build the site from its source
```

## Publishing the Website
When you've made the desired changes, simply execute:
```shell
rake publish
```
This will rebuild the site, commit your changes to the `main` branch, and deploy the generated site to `stanfordasl.github.io` with the new changes.

**NOTE**: This GitHub Pages link is where the `asl.stanford.edu` and `asl-origin.stanford.edu` proxies point to, so this repository and the corresponding GitHub Page is the "actual" website.
