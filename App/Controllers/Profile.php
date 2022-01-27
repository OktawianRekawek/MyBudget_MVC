<?php

namespace App\Controllers;

use \Core\View;
use \App\Auth;
use \App\Flash;
use \App\Models\User;

/**
 * Profile controller
 */
class Profile extends Authenticated
{
  
  /**
   * Before filter - called before each action method
   *
   * @return void
   */
  protected function before()
  {
    parent::before();
    
    $this->user = Auth::getUser();
  }
  
  /**
   * Show addincome page
   *
   * @return void
   */
  public function addIncomeAction()
  {
    View::renderTemplate('Profile/incomes.html', [
        'user' => $this->user,
        'currentDate' => date('Y-m-d'),
        'categories' => User::getIncomeCategories($this->user->id)
      ]);
  }
  
  /**
   * Show addExpanse page
   *
   * @return void
   */
  public function addExpenseAction()
  {
    View::renderTemplate('Profile/expenses.html', [
        'user' => $this->user,
        'currentDate' => date('Y-m-d'),
        'categories' => User::getExpensesCategories($this->user->id),
        'paymentMethods' => User::getPaymentMethods($this->user->id)
      ]);
  }
  
  /**
   * Show the settings page
   *
   * @return void
   */
  public function settingsAction()
  {
    View::renderTemplate('Profile/settings.html', [
      'user' => $this->user
    ]);
  }
  
  /**
   * Update the profile
   *
   * @return void
   */
  public function updateAction()
  {
    
    if ($this->user->updateProfile($_POST)) {
      
      Flash::addMessage('Changes saved');
      
      $this->redirect('/profile/show');
      
    } else {
      
      View::renderTemplate('Profile/edit.html', [
        'user' => $this->user
      ]);
      
    }
  }
  
  /**
   * Add income to database
   *
   * @return void
   */
  public function createIncomeAction()
  {
    if ($this->user->addIncome($_POST)) {
      
      View::renderTemplate('Profile/incomes.html', [
        'success' => 'Przychód został dodany!',
        'user' => $this->user,
        'currentDate' => date('Y-m-d'),
        'categories' => User::getIncomeCategories($this->user->id)
      ]);

    } else {
      
      View::renderTemplate('Profile/incomes.html', [
        'error' => 'Wpisz prawidłową kwotę!',
        'user' => $this->user,
        'currentDate' => $_POST['date'],
        'categories' => User::getIncomeCategories($this->user->id),
        'currCategory' => $_POST['category'],
        'currComment' => $_POST['comment'],
        'currAmount' => $_POST['amount']
      ]);
    }
  }
  
  /**
   * Add expense to database
   *
   * @return void
   */
  public function createExpenseAction()
  {
    if ($this->user->addExpense($_POST)) {
      
      View::renderTemplate('Profile/expenses.html', [
        'success' => 'Wydatek został dodany!',
        'user' => $this->user,
        'currentDate' => date('Y-m-d'),
        'categories' => User::getExpensesCategories($this->user->id),
        'paymentMethods' => User::getPaymentMethods($this->user->id)
      ]);

    } else {
      
      View::renderTemplate('Profile/expenses.html', [
        'error' => 'Wpisz prawidłową kwotę!',
        'user' => $this->user,
        'currentDate' => $_POST['date'],
        'categories' => User::getExpensesCategories($this->user->id),
        'paymentMethods' => User::getPaymentMethods($this->user->id),
        'currCategory' => $_POST['category'],
        'currComment' => $_POST['comment'],
        'currAmount' => $_POST['amount']
      ]);
    }
  }
  
   /**
   * Show balance page
   *
   * @return void
   */
  public function showBalanceAction()
  {
    $selectedPeriod="Bieżący miesiąc";
    
    if (isset($_POST['period'])){
      $selectedPeriod = $_POST['period'];
      if ($selectedPeriod == "Poprzedni miesiąc") {
        $startDate = mktime(0,0,0,date('m')-1,1,date('Y')) ;
        $endDate = mktime(0,0,0,date('m'),0,date('Y')) ;
      }
      else if ($selectedPeriod == "Bieżący rok") {
        $startDate = mktime(0,0,0,1,1,date('Y')) ;
        $endDate = mktime(0,0,0,12,31,date('Y')) ;
      } else {
      $startDate = mktime(0,0,0,date('m'),1,date('Y')) ;
      $endDate = mktime(0,0,0,date('m')+1,0,date('Y')) ;
      }
    } else {
      $startDate = mktime(0,0,0,date('m'),1,date('Y')) ;
      $endDate = mktime(0,0,0,date('m')+1,0,date('Y')) ;
    }
  
  
   if ($selectedPeriod == "Niestandardowy" && isset($_POST['date1']) && isset($_POST['date2']) && ($_POST['date1'] <= $_POST['date2'])) {
      $startDateSQL = $_POST['date1'];
      $endDateSQL = $_POST['date2'];
    } else {
      $startDateSQL = date("Y-m-d",$startDate);
      $endDateSQL = date("Y-m-d",$endDate);
    }
    
    $expenses = $this->user->getExpenses($startDateSQL,$endDateSQL);
    $incomes = $this->user->getIncomes($startDateSQL,$endDateSQL);
    
    $expensesSum = 0;
    $incomesSum = 0;
    
    foreach ($expenses as $expense) {
      $expensesSum += $expense['amount'];
    }
    
    foreach ($incomes as $income) {
      $incomesSum += $income['amount'];
    }
    
    $balance = $incomesSum - $expensesSum;
    
    View::renderTemplate('Profile/balance.html', [
        'user' => $this->user,
        'currentDate' => date('Y-m-d'),
        'periods' => ['Bieżący miesiąc', 'Poprzedni miesiąc', 'Bieżący rok', 'Niestandardowy'],
        'currPeriod' => $selectedPeriod,
        'date1' => $startDateSQL,
        'date2' => $endDateSQL,
        'expenses' => $expenses,
        'incomes' => $incomes,
        'expensesSum' => $expensesSum,
        'incomesSum' => $incomesSum,
        'balance' => $balance
      ]);
    
  }
  
  /**
   * Show Incomes Categories
   *
   * @return void
   */
  public function getIncomesCategoriesAction()
  {
    $categories = User::getIncomeCategories($this->user->id);
    
    echo json_encode($categories);
  }

  /**
   * Show Expenses Categories
   *
   * @return void
   */
  public function getExpensesCategoriesAction()
  {
    $categories = User::getExpensesCategories($this->user->id);
    
    echo json_encode($categories);
  }

  /**
   * Save Income Category Settings
   * 
   * @return void
   */
  
  public function saveCategorySettingsAction()
  {
    if (!strcmp($_POST['category'], 'income'))
      User::saveIncomeSettings($_POST);
    else if (!strcmp($_POST['category'], 'expense'))
      User::saveExpenseSettings($_POST);
  }
}
