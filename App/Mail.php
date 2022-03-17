<?php

namespace App;

use Mailgun\Mailgun;
use App\Config;

/**
 * Mail
 */
class Mail
{
  /**
   * Send a message
   *
   * @param string $to Recipient
   * @param string $subject Subject
   * @param string $text Text-only content of the message
   * @param string $html HTML content of the message
   *
   * @return mixed
   */
  public static function send($to, $subject, $text, $html)
  {
    # Instantiate the client.
    //$mg = Mailgun::create(Config::MAILGUN_API_KEY); // For US servers
    $mg = Mailgun::create(Config::MAILGUN_API_KEY, 'https://api.eu.mailgun.net/v3'); // For EU servers
    $domain = Config::MAILGUN_DOMAIN;
    # Make the call to the client.
    $mg->messages()->send($domain, array(
        'from'	=> 'oktawian@oktawianrekawek.pl',
        'to'	=> $to,
        'subject' => $subject,
        'text'	=> $text,
        'html'  => $html
    ));
  }
}
