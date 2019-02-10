---
title: Tame Behat with the Brand New Symfony Extension 
date: "2019-02-11"
spoiler: "Do you use Behat with Symfony? Here's why you should consider switching to FriendsOfBehat's SymfonyExtension."
---

Over two years after the first stable release of this [Friends of Behat]'s [Symfony Extension], I'm happy to announce
the availability of the second major version and write more about it.

It is already battle-tested solution with [Sylius][sylius-fobse-pr] on 1300+ scenarios containing 14000+ steps and gets 
traction in projects like [Akeneo][akeneo-fobse-pr] or [Monofony][monofony-fobse-pr]. 

The mission behind it is to simplify the process of implementing [Behat] contexts so that you can focus on the communication 
with stakeholders and writing down business features instead of figuring out low-level testing infrastructure details.

### TL;DR

- Support for Symfony's autowiring and autoconfiguration
- Symfony Flex contrib recipe to make installation easier
- Zero-configuration for most Symfony 3 and 4 based apps
- Unified application configuration and dotenv file handling (similar to the PHPUnit one)
- Integration with Mink, available out of the box
- Simplified usage, reduced the number of extensions from three to one
- Improved developer experience with more descriptive exceptions and more predictable overall behaviour

The paragraphs down below explain the reasoning behind design decisions made in the new extension. 

If you want to try it first, [dive straight into the documentation][fobse-docs]. 

I am working on an entry-level tutorial for SymfonyExtension v2, make sure to [follow me on Twitter][twitter-follow] 
if you do not want to miss it.

### Support for Symfony's autowiring and autoconfiguration

Every time I introduced someone new to Behat and Symfony, the number of modifications needed to implement even simple steps
was an issue. 

Whether it was `Behat/Symfony2Extension` or `FriendsOfBehat/SymfonyExtension`, injecting a dependency into
a context required too much hassle and pulled us away from the domain being modelled.

It is a common use case to have a context which implements a step like `Given I am a logged in customer` that is used in
every suite which does web acceptance testing. 

Let's assume we need two Behat suites using the same context depending on `kernel` service and compare the required 
configuration for every Behat - Symfony extension out there.

#### Behat/Symfony2Extension

```yaml
# behat.yml
first_suite:
    contexts: # highlight-line
        - FeatureContext: # highlight-line
            kernel: '@kernel' # highlight-line
            
second_suite:
    contexts: # highlight-line
        - FeatureContext: # highlight-line
            kernel: '@kernel' # highlight-line
```

Finding all places where a context is used and modifying its dependencies is a boring work, which I wanted to avoid in 
the first version of <abbr title="Friends Of Behat">FOB</abbr>'s SymfonyExtension. 

It was possible by registering contexts as services, but it fundamentally changes the way you use Behat. 
This is why I decided to write my own extension to integrate Behat with Symfony.

#### FriendsOfBehat/SymfonyExtension v1

```yaml
# behat.yml
first_suite:
    contexts_services: # highlight-line
        - FeatureContext # highlight-line
            
second_suite:
    contexts_services: # highlight-line
        - FeatureContext # highlight-line
```

```yaml
# Symfony services file loaded by the extension
services:
    FeatureContext:
        arguments:
            - '@__symfony__.kernel' # highlight-line
        tags: ['fob.context_service'] # highlight-line
```

This gets rid of the duplicated context configuration, but introduces more boilerplate and own conventions which are hard
to get at the first look:

- `contexts_services` instead of default `contexts` has not introduced any measurable benefits, it was supposed to prevent 
  conflicts with the basic configuration for ones not using context services in every suite
  
- the `__symfony__` prefix when referencing service from Symfony application container prevented autocomplete in IDEs
  from working correctly
  
- the `fob.context_service` tag was required by the internal infrastructure to be able to use a service as a context, but
  it caused bugs quite often as it was so easy to forget it
  
The duplication has been reduced, but the whole process of registering contexts manually was far from pleasant. The newest
version tackles it by incorporating autowiring and autoconfiguration as first-class mechanisms and removes the boilerplate.

#### FriendsOfBehat/SymfonyExtension v2

```yaml
# behat.yml
first_suite:
    contexts: # highlight-line
        - App\Tests\Behat\FeatureContext # highlight-line
            
second_suite:
    contexts: # highlight-line
        - App\Tests\Behat\FeatureContext # highlight-line
```

If your context constructor has kernel argument type-hinted, this is all you need to make it work. 

No need to worry about duplicated configuration, weird conventions, tagging contexts or using prefixes when referring to services.
And you can reference private services as well! 

The extension provides a dependency injection configuration which automatically finds your contexts and autowires them:

```yaml
# config/services_test.yaml
services:
    _defaults:
        autowire: true
        autoconfigure: true

    App\Tests\Behat\:
        resource: '../tests/Behat/*'
```

The following file is loaded only in the test environment. Your production and development environments are not
affected with any performance loss. However, if you prefer not to rely on autowiring, you can define the service on your
own - remember to make it public though:

```yaml
# config/services_test.yaml
services:
    App\Tests\Behat\FeatureContext:
        arguments:
            - '@kernel'
        public: true
```

### Symfony Flex recipe

If you use [Symfony Flex] to manage your Symfony application, installation and configuration of the extension could not be easier.

All you need to do is to install the extension and agree for installing a contrib recipe for it:

```bash
composer install friends-of-behat/symfony-extension:^2.0 --dev
composer exec behat
``` 

In less than a minute you have a working setup of Behat with SymfonyExtension and you are ready to write your features.

If you do not use Symfony Flex, [follow the installation documentation][fobse-docs-installation].

### Zero-configuration for most Symfony 3 and 4 based apps

Whether you use Symfony 3 or Symfony 4, the new extension got you covered. 

It will try to guess the sensible default configuration and in most cases, you will not need to write any more configuration than 
the following (assuming Flex have not done it for you):

```yaml
# behat.yml
default:
    extensions:
        FriendsOfBehat\SymfonyExtension: ~
```

[Learn more about the default settings][fobse-docs-configuration].

### Mink integration

This extension provides a driver for [Mink] based on BrowserKit called `symfony`. 

If you switch from `Behat\Symfony2Extension`, the behaviour stays mostly the same. 
There is only one minor implementation detail that is worth to know.

`symfony2` driver from the former extension uses the same kernel for both fetching application services and handling
requests. This might lead to unexpected results if your code is not idempotent and relies on services state.

Given the following scenario and its implementation:

```gherkin
# Please do not write scenarios like this
# It is just for demonstration purposes
Given the service state is set to 42
Then I should get 42 from the API
And I should get 42 from the API
```

```php
# Context implementation
/**
 * @Given the service state is set to :state
 */
public function serviceStateIs(string $state): void
{
    $this->service->setState($state);
}

/**
 * @Then I should get :state from the API
 */
public function iShouldGetFromAPI(string $state): void
{
    $this->minkSession->visit('/api/');
    assert($state === $this->minkSession->getPage()->getContent());
}
```

```php
# Symfony controller
public function __invoke(): Response
{
    return new Response($this->service->getState());
}
```

This scenario would fail on the second `Then` step when using `Behat\Symfony2Extension`. It happens because
the kernel is rebooted after each request. It causes unstable results and allows for fragile tests.

When run with `FriendsOfBehat\SymfonyExtension`, the scenario would fail on the first `Then` step because the service 
state is not shared between Behat and HTTP application.

If you want to learn more, check out [the documentation about differences between Symfony extensions][fobse-docs-differences]
or [the documenation about Mink integration][fobse-docs-mink].


### What's next?

With all those new, shiny features mentioned above, there are still a few ideas in my mind that would be great to have:

- [providing Mink as a service](https://github.com/FriendsOfBehat/SymfonyExtension/issues/61)
- [autowiring and autoconfiguration for steps definitions](https://github.com/FriendsOfBehat/SymfonyExtension/issues/62)
- [exposing BrowserKit API as complementary to Mink API (with Panther support)](https://github.com/FriendsOfBehat/SymfonyExtension/issues/67)

I made a GitHub project which is used as a [roadmap][fobse-roadmap] for this project.

[akeneo-fobse-pr]: https://github.com/akeneo/pim-community-dev/pull/9416
[Behat]: http://behat.org/en/latest/
[fobse-docs-configuration]: https://github.com/FriendsOfBehat/SymfonyExtension/blob/master/docs/05_configuration_reference.md#configuration-reference
[fobse-docs-differences]: https://github.com/FriendsOfBehat/SymfonyExtension/blob/master/docs/04_bs2e_differences.md#differences-from-behatsymfony2extension
[fobse-docs-installation]: https://github.com/FriendsOfBehat/SymfonyExtension/blob/master/docs/01_installation.md#installation
[fobse-docs-mink]: https://github.com/FriendsOfBehat/SymfonyExtension/blob/master/docs/03_mink_integration.md#mink-integration
[fobse-docs]: https://github.com/FriendsOfBehat/SymfonyExtension#documentation
[fobse-roadmap]: https://github.com/FriendsOfBehat/SymfonyExtension/projects/1
[Friends Of Behat]: https://github.com/FriendsOfBehat
[Mink]: http://mink.behat.org/en/latest/
[monofony-fobse-pr]: https://github.com/Monofony/SymfonyStarter/pull/103
[PHPUnit]: https://phpunit.de/
[sylius-fobse-pr]: https://github.com/Sylius/Sylius/pull/10102
[Sylius]: https://sylius.com/
[Symfony Extension]: https://github.com/FriendsOfBehat/SymfonyExtension
[Symfony Flex]: https://symfony.com/doc/current/setup/flex.html
[symfony-dotenv-changes]: https://symfony.com/doc/current/configuration/dot-env-changes.html
[twitter-follow]: https://twitter.com/intent/follow?region=follow_link&screen_name=pamilme&source=followbutton&variant=2.0
