---
title: "SymfonyExtension 2.1: Behat with Symfony 5" 
date: "2020-04-05"
spoiler: |
    Friends of Behat's SymfonyExtension becomes more and more popular as the downloads rose almost fivefold in the last year.
    I'm happy to announce the new release bringing support for Symfony 5 and PHP 7.4, together with functional improvements.
---

[Friends of Behat's SymfonyExtension][fob-se] becomes more and more popular as the downloads rose almost fivefold in the last year.
I'm happy to announce the new release bringing support for Symfony 5 and PHP 7.4, together with functional improvements.

If you haven't got to know it before, I'd recommend to [reading last release announcement][fob-se-20-blogpost].

### Symfony 5 and PHP 7.4 support

With Symfony 5 and PHP 7.4 released in late November 2019, adding support for it was only a matter of time.
Behat officially started supporting those in early February 2020 and SymfonyExtension was ready for it shortly after. 

Unfortunately, Mink ecosystem was lagging behind. Since most of the projects rely on both Behat and Mink,
I've decided to fork those libraries to Friends of Behat organisation. This way, I could quickly release drop-in replacements
for problematic libraries, having Symfony 5 support as my only objective - any other improvements or changes are currently not accepted. 

The mentioned packages are `behat/mink`, `behat/mink-extension` and `behat/mink-browserkit-driver`. To use the
forked versions, replace `behat` with `friends-of-behat` in their name, ending up with `friends-of-behat/mink`,
`friends-of-behat/mink-extension` and `friends-of-behat/mink-browserkit-driver` respectively.

SymfonyExtension 2.1 removes support for Symfony 3.4, leaving Symfony ^4.4 and ^5.0 as the only supported versions. As for PHP,
all versions between 7.1 and 7.4 are currently supported.

Learn more: [Symfony 5](https://github.com/FriendsOfBehat/SymfonyExtension/pull/100), [PHP 7.4](https://github.com/FriendsOfBehat/SymfonyExtension/pull/107).

### Mink's driver service container exposed

Raised multiple times in issues on the repository, the 2.0 release removed the possibility of getting into Mink's driver
service container easily. Getting it is especially helpful when you want to assert emails sent or messages dispatched during the
last HTTP request. 

Starting from SymfonyExtension 2.1, you only need to inject `behat.driver.service_container` service or ask for
`ContainerInterface $driverContainer` to get access to your services within the tested application, both private and public.

```php
final class SomeContext implements Context {
    /** @var Session */
    private $minkSession;
    
    /** @var ContainerInterface */
    private $driverContainer;

    public function __construct(Session $minkSession, ContainerInterface $driverContainer)
    {
        $this->minkSession = $minkSession;
        $this->driverContainer = $driverContainer;
    }

    /** @When I visit the page :page */
    public function visitPage(string $page): void
    {
        $this->minkSession->visit($page);
    }

    /** @Then the counter service should return :number */
    public function counterServiceShouldReturn(int $number): void
    {
        assert($number === $this->driverContainer->get('App\Counter')->getCount());
    }
}
```

Learn more: [Driver service container exposed](https://github.com/FriendsOfBehat/SymfonyExtension/pull/116).

### Simple BrowserKit integration

If you don't need Mink's flexibility, the latest release contains a simple integration with BrowserKit. Whenever you
require `Symfony\Bundle\FrameworkBundle\KernelBrowser` or `Symfony\Component\HttpKernel\HttpKernelBrowser` in your context,
it'll be autowired to `test.client` service.

```php
final class SomeContext implements Context 
{
    /** @var KernelBrowser */
    private $browser;

    public function __construct(KernelBrowser $browser)
    {
        $this->browser = $browser;
    }

    /** @When I visit the page :page */
    public function visitPage(string $page): void
    {
        $this->browser->request('GET', $page);
    }
}
```

Learn more: [BrowserKit integration](https://github.com/FriendsOfBehat/SymfonyExtension/pull/82).

### Mink service exposed

As 2.0 has only supported exposing Mink's default session, 2.1 brings more flexibility in that manner. It is possible
to both inject and autowire the whole Mink service to your context now.

```php
final class SomeContext implements Context
{
    /** @var Mink */
    private $mink;

    public function __construct(Mink $mink)
    {
        $this->mink = $mink;
    }

    /** @When I visit the page :page */
    public function visitPage(string $page): void
    {
        $this->mink->getSession()->visit($page);
    }
}
```

Learn more: [Mink](https://github.com/FriendsOfBehat/SymfonyExtension/pull/69).

### FOB's PageObjectExtension integration

[Friends of Behat's PageObjectExtension][fob-poe] is a Behat extension inspired by [SensioLabs' PageObjectExtension][sl-poe],
that is used by Sylius to abstract away pages and elements details from Behat contexts. Unfortunately, the latter could
not be supported by SymfonyExtension, due to using Mink's Element classes which breaks lazy-loading for Mink integration.

Within this integration, all the pages and elements are autowired and autoconfigured, which reduces the need to write
boring infrastructure code. When in doubt, take a look at the feature file in SymfonyExtension or its usage in Sylius.

```php
final class LoginContext implements Context
{
    /** @var LoginPageInterface */
    private $loginPage;

    public function __construct(LoginPageInterface $loginPage)
    {
        $this->loginPage = $loginPage;
    }

    /** @When I log in as :username */
    public function iWantToLogIn(string $username): void
    {
        $this->loginPage->open();
        $this->loginPage->login($username, 'password');
    }
}
```

Learn more: [FOB's PageObjectExtension](https://github.com/FriendsOfBehat/SymfonyExtension/pull/105), [SensionLabs' PageObjectExtension](https://github.com/FriendsOfBehat/SymfonyExtension/issues/99).
 
### Conclusion

SymfonyExtension is on its way to surpass one million downloads in the next month. I'm pleased to create a library that
is useful and removes friction when adopting BDD and automatizing scenarios. 

As for the future developments, I'd like to replace Mink with a dedicated, Symfony-based alternative API. 
Publishing a tutorial on making use of BDD within Symfony 5 application context is also an interesting idea.
Feel free to let me know what would you like to see first! 

[fob-poe]: https://github.com/FriendsOfBehat/PageObjectExtension
[fob-se]: https://github.com/FriendsOfBehat/SymfonyExtension
[fob-se-20-blogpost]: https://kamilkokot.com/tame-behat-with-the-brand-new-symfony-extension/
