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
  public function createIncomeAction()
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
  public function createExpenseAction()
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
  public function addIncomeAction()
  {
    if ($this->user->addIncome($_POST)) {
      echo json_encode(0);
    } else {
      echo json_encode(1);
    }
  }
  
  /**
   * Add expense to database
   *
   * @return void
   */
  public function addExpenseAction()
  {
    if ($this->user->addExpense($_POST)) {
      echo json_encode(0);
    } else {
      echo json_encode(1);
    }
  }

  public function getExpensesAction()
  {
    $expenses = $this->user->getExpenses($_POST['startDate'],$_POST['endDate']);
    
    echo json_encode($expenses);
  }

  public function getAllExpensesAction()
  {
    $expenses = $this->user->getAllExpenses($_POST['startDate'],$_POST['endDate']);
    
    echo json_encode($expenses);
  }

  public function getIncomesAction()
  {
    $incomes = $this->user->getIncomes($_POST['startDate'],$_POST['endDate']);
    
    echo json_encode($incomes);
  }

  public function getAllIncomesAction()
  {
    $incomes = $this->user->getAllIncomes($_POST['startDate'],$_POST['endDate']);
    
    echo json_encode($incomes);
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
      $expensesSum += $expense['amountSum'];
    }
    
    foreach ($incomes as $income) {
      $incomesSum += $income['amountSum'];
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
   * Show Payment Methods Categories
   *
   * @return void
   */
  public function getPaymentMethodsCategoriesAction()
  {
    $categories = User::getPaymentMethods($this->user->id);
    
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
    {
      if ($_POST['id'] == NULL)
      {
        $this->user->addIncomeCategory($_POST);
        $lastid = User::getLastId("incomes_category_assigned_to_users");
       // file_put_contents("dbg.txt", $lastid);
       echo json_encode($lastid);
      }
      else
      {
        User::saveIncomeSettings($_POST);
        echo json_encode(0);
      }
    }
    else if (!strcmp($_POST['category'], 'expense')) 
    {
      if ($_POST['id'] == NULL)
      {
        $this->user->addExpenseCategory($_POST);
        $lastid = User::getLastId("expenses_category_assigned_to_users");
        // file_put_contents("dbg.txt", $lastid);
       echo json_encode($lastid);
      }
      else
      {
        User::saveExpenseSettings($_POST);
        echo json_encode(0);
      }
    }
    else if (!strcmp($_POST['category'], 'payment')) 
    {
      if ($_POST['id'] == NULL)
      {
        $this->user->addPaymentCategory($_POST);
        $lastid = User::getLastId("payment_methods_assigned_to_users");
        // file_put_contents("dbg.txt", $lastid);
       echo json_encode($lastid);
      }
      else
      {
        User::savePaymentSettings($_POST);
        echo json_encode(0);
      }
    }
      
  }

  public function changeUserSettingsAction()
  {
    if(isset($_POST["name"]))
    {
      $ret = $this->user->changeUserSettings($_POST);
      // file_put_contents("dbg.txt", $ret);
      echo json_encode($ret);
    }
    if(isset($_POST["password"]))
    {
      $ret = $this->user->changeUserPassword($_POST);
      echo json_encode($ret);
    }
  }

  public function deleteCategoryAction()
  {
    if (isset($_POST))
    {
      $ret = $this->user->deleteCategory($_POST);
      echo json_encode($ret);
    }
    else
      echo json_encode(1);
  }

  public function deleteRecordAction()
  {
    if (isset($_POST))
    {
      $ret = $this->user->deleteRecord($_POST);
      echo json_encode($ret);
    }
    else
      echo json_encode(1);
  }

  public function saveRecordAction()
  {
    if (isset($_POST))
    {
      file_put_contents("dbg.txt", $_POST);
      $ret = $this->user->updateRecord($_POST);
      echo json_encode($ret);
    }
    else
      echo json_encode(1);
  }
}
