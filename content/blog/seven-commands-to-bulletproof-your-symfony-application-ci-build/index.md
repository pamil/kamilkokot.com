---
title: Seven Commands to Bulletproof Your Symfony Application CI Build 
date: "2020-01-12"
spoiler: |
    Over the course of years, I noticed there are more and more checks that are usually performed in our Symfony applications'
    CI environment. This is my attempt at writing down the most useful ones.
tweet: <blockquote class="twitter-tweet tw-align-center" data-cards="hidden"><p lang="en" dir="ltr">Over the course of years, I noticed there are more and more checks that are usually performed in our <a href="https://twitter.com/hashtag/symfony?src=hash&amp;ref_src=twsrc%5Etfw">#symfony</a> applications’ CI environment. This is my attempt at writing down the most useful ones. <a href="https://t.co/XGJF0jTd13">https://t.co/XGJF0jTd13</a></p>&mdash; Kamil Kokot (@pamilme) <a href="https://twitter.com/pamilme/status/1216661904866906114?ref_src=twsrc%5Etfw">January 13, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
---

Over the course of years, I noticed there are more and more checks that are usually performed in our Symfony applications'
CI environment. This is my attempt at writing down the most useful ones.

Table of contents:

1. [Checking for security vulnerabilities](#1-checking-for-security-vulnerabilities)
2. [Validating package configuration](#2-validating-package-configuration)
3. [Linting Symfony container](#3-linting-symfony-container)
4. [Linting Twig templates](#4-linting-twig-templates)
5. [Linting YAML files](#5-linting-yaml-files)
6. [Testing Doctrine migrations](#6-testing-doctrine-migrations)
7. [Validating Doctrine mappings](#7-validating-doctrine-mappings)

### 1. Checking for security vulnerabilities

Security should be the most critical concern while developing any application. It should come as no surprise that there are 
multiple solutions for ensuring that our application does not rely on dependencies with known vulnerabilities.
Although they differ in usage, they are all based on the same source - [FriendsOfPHP/security-advisories][fop-security-advisories].

#### Symfony CLI

It is provided together with [the Symfony binary][symfony-binary], which is a recommended way to create new Symfony projects and includes
a convenient local web server, which comes handy during development. 

If you already use it as a web server in your CI build, I would recommend using it also for security checks.

```bash
symfony security:check
```

If you do not have it in your CI build yet, the following `.travis.yml` configuration does the job:

```yaml
cache:
    directories:
        - ~/.symfony

before_install:
    - |
        if [ ! -f ~/.symfony/bin/symfony ]; then
            wget https://get.symfony.com/cli/installer -O - | bash
        fi

script:
    - ~/.symfony/bin/symfony security:check
```

#### SensioLabs Security Checker

[SensioLabs/SecurityChecker][sensiolabs-security-checker] is what I've been using before switching to Symfony CLI. It uses `security.symfony.com` API
to perform the check, which means your `composer.lock` will be uploaded there.

To use it, add `sensiolabs/security-checker` to your `require-dev` section in `composer.json` and then run the following command:

```bash
vendor/bin/security-checker security:check
```

#### Roave Security Advisories

While the previous two tools work in a similar way, [Roave/SecurityAdvisories][roave-security-advisories] takes a different approach.

It is a Composer package which defines vulnerable packages as its conflicts, preventing them from being installed and resulting in irresolvable dependencies.
This behaviour is a double-edged sword - it does not trigger when packages dependencies are installed from the lock file.

My recommendation is to require this package only in the CI build:

```bash
composer install
composer require --dev roave/security-advisories
```

However, resolving dependencies in complex projects takes a lot of time, which makes me prefer the other solutions.

### 2. Validating package configuration

Composer provides a command to validate your `composer.json` and `composer.lock` files. It checks whether your lock file
is up-to-date, whether used constraints are not too loose or too strict and whether the package is valid to be published on Packagist.

```bash
composer validate --strict
```

There are a few switches available for this command:

 - `--strict`
    
    Makes the command return non-zero code for warnings as well as errors. 
    For example, having overly strict dependency (`1.0.0` instead of `^1.0`) in `require` section will trigger a warning.
    
 - `--no-check-all`
    
    Disables checking for overly strict or unbound dependencies in `require` section.
    Even without this switch, it does not check the dependencies defined in `require-dev` section.
    
 - `--no-check-lock`
 
    Disables checking whether the lock file is up-to-date.
    
 - `--no-check-publish`
 
    Ignores errors which prevent the package from be published on Packagist. Useful for internal applications that will
    not be published, but required for open source packages.

I would recommend you starting with the most strict check and ignoring some parts later if needed.

### 3. Linting Symfony container

[Introduced with Symfony 4.4][symfony-lint-container], linting the container might help in finding dead services configurations.
We found [a few in Sylius][sylius-lint-container] and decided to add it to the build to prevent us from introducing them anymore.

```bash
bin/console lint:container
```

### 4. Linting Twig templates

Linting your Twig templates checks their syntax and might detect unused templates if an unexisting filter or function is used in those.
[After running it on Sylius codebase][sylius-lint-twig], it has found a template calling parent blocks while not extending any template itself 
and another template calling an unexisting filter.

```bash
bin/console lint:twig templates
```

Starting from Symfony 4.4, this command also includes a way to report usages of deprecated Twig features. It helped greatly with [the upgrade
to Twig 3][sylius-lint-twig-deprecated]. 

```bash
bin/console lint:twig templates--show-deprecations
```

I would not recommend adding deprecation checks to your CI build as it would make it more unstable - any deprecation in next Twig version would make it fail.

### 5. Linting YAML files

It is easy to make errors writing YAML files compared to XML. Therefore, it is essential to get feedback on those as fast as possible.

```bash
bin/console lint:yaml config src translations
```

### 6. Testing Doctrine migrations

If you provide Doctrine migrations in your application, it is desirable to test them. Most applications include the following
line in their CI builds:

```bash
bin/console doctrine:migrations:migrate --no-interaction
```

While this covers the most common path, it does not test reverting these migrations.

```bash
bin/console doctrine:migrations:migrate --no-interaction
bin/console doctrine:migrations:migrate first --no-interaction
bin/console doctrine:migrations:migrate --no-interaction
```

These three commands will first create the schema in the database, then revert the changes and create it once again.

### 7. Validating Doctrine mappings

After the migrations have been run or the database schema has been synchronised in any other way, it's worth to validate
your Doctrine mappings and whether they're correctly synchronised with the database schema. 

It can be done with the following command:

```bash
bin/console doctrine:schema:validate
```

### Conclusion

Surely, this list is non-exhaustive: it completely misses static analysers, testing frameworks, coding standard fixers and automation tools,
which I would like to include in another blog post in this series.

What it mainly focuses on are commands that can be added with little effort but might be often overlooked. If you use one of those,
but it wasn't mentioned above, let me know in the comments!

[fop-security-advisories]: https://github.com/FriendsOfPHP/security-advisories
[roave-security-advisories]: https://github.com/Roave/SecurityAdvisories
[sensiolabs-security-checker]: https://github.com/sensiolabs/security-checker
[sylius-lint-container]: https://github.com/Sylius/Sylius/pull/10926
[sylius-lint-twig-deprecated]: https://github.com/Sylius/Sylius/pull/10955
[sylius-lint-twig]: https://github.com/Sylius/Sylius/pull/8056
[symfony-binary]: https://symfony.com/download
[symfony-lint-container]: https://symfony.com/blog/new-in-symfony-4-4-service-container-linter
