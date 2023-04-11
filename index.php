<?php 
#phpinfo() 
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>To-Do List</title>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://kit.fontawesome.com/17b191d583.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="./index.js"></script>
    <script src="./login.js"></script>
</head>
<body class="mw-100 overflow-hidden" id="body">
    <div id="body-login" class="d-none d-flex justify-content-center align-items-center w-100 h-100">
        <div class="modal fade" id="login-modal" tabindex="-1" aria-labelledby="modal-label" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">Account Login</h1>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="mb-3">
                                <label for="username-input" class="col-form-label">Username:</label>
                                <input type="text" class="form-control" id="username-input">
                            </div>
                            <div class="mb-3">
                                <label for="password-input" class="col-form-label">Password:</label>
                                <input type="password" class="form-control" id="password-input"></input>
                            </div>
                            <div class="d-none" id="login-incorrect-container">
                                <p class="text-danger m-0">Invalid credentials. Check username and password.</p>
                            </div>
                            <div class="d-none" id="login-error-container">
                                <p class="text-danger m-0 fw-bold">LOGIN ERROR! Try again later.</p>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-primary" id="login-button">
                            <i class="fa-solid fa-right-to-bracket"></i> SIGN IN
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="body-main" class="d-none">
        <div class="d-flex flex-row justify-content-between align-items-center mt-3 mx-3">
            <h1 id="title">To-Do List</h1>
            <div class="align-self-end d-flex flex-column justify-content-evenly align-items-end">
                <p class="h6">
                    <span class="h5" id="total-tasks-label">LOADING</span> Total Tasks
                </p>
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" value="" id="show-archived-check">
                    <label class="form-check-label" for="show-archived-check">
                        Show Archived<span class="d-none d-sm-inline"> Tasks</span>
                    </label>
                </div>
            </div>
        </div>

        <table class="table table-hover table-responsive-md" aria-describedby="title">
            <thead>
            <tr>
                <th scope="col">ID</th>
                <th>Title</th>
                <th class="w-50">Description</th>
                <th>Status</th>
                <th></th>
            </tr>
            </thead>
            <tbody id="task-list">
            <tr id="empty-label" class="text-center table-dark">
                <td colspan="5">NO TASKS</td>
            </tr>
            <tr id="task-format" class="d-none">
                <td class="fw-bold">ERROR</td>
                <td class="text-break">ERROR</td>
                <td class="text-break">ERROR</td>
                <td>
                    <button class="btn btn-status text-nowrap">ERROR</button>
                </td>
                <td class="text-end text-nowrap">
                    <button class="btn btn-outline-secondary btn-edit">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn btn-outline-danger ms-1 btn-delete">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
        <div class="w-100 d-flex flex-row gap-2 align-items-center justify-content-center mt-1">
            <button class="btn btn-outline-primary me-2" id="btn-add">
                <i class="fa-solid fa-plus"></i> <span class="d-none d-sm-inline">ADD NEW</span>
            </button>
            <button class="btn btn-outline-warning" id="btn-clear">
                <i class="fa-solid fa-trash"></i> <span class="d-none d-sm-inline">REMOVE </span>COMPLETED
            </button>
            <button class="btn btn-outline-danger" id="btn-clear-all">
                <i class="fa-solid fa-trash"></i> <span class="d-none d-sm-inline">REMOVE </span>ALL
            </button>
        </div>
        <div class="mt-4 w-100 d-flex flex-row gap-2 align-items-center justify-content-center mt-1">
            <button class="btn btn-danger" id="btn-logout">
                LOG OUT
            </button>
        </div>  

        <div class="modal fade" id="task-modal" tabindex="-1" aria-labelledby="modal-label" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="modal-label">ERROR</h1>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="mb-3">
                                <label for="input-title" class="col-form-label">Title:</label>
                                <input type="text" class="form-control" id="input-title">
                            </div>
                            <div class="mb-3">
                                <label for="input-description" class="col-form-label">Description:</label>
                                <textarea class="form-control" id="input-description"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                            <i class="fa-solid fa-ban"></i> CANCEL
                        </button>
                        <button type="button" class="btn btn-outline-primary" id="btn-submit-modal">
                            <i class="fa-solid fa-floppy-disk"></i> SAVE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>