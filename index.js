const timeout = 2_500;
const hiddenClass = 'd-none';
const newTaskTitleText = 'Add New Task';
const editTaskTitleText = 'Edit Task (#{ID})'
const completeStatus = 2;
const archivedStatus = 3;

let defaultModalTitle = '';
let taskFormat, tableBody, modalElement, modal, modalTitle, taskCount,
	showArchivedCheck, btnSave, inputTitle, inputDesc, noDataRow;
let modalMode = null;
let statusInfo = [];
let tasks = [];

function updatedTasks() {
	const count = tasks.length;
	if (count > 0) {
		noDataRow.classList.add(hiddenClass);
	} else {
		noDataRow.classList.remove(hiddenClass);
	}
	taskCount.innerText = count;
}

function updateTaskData(data) {
	const elements = data.propElements;
	const status = statusInfo[data.status];
	const btnStatus = elements.status;
	if (!status || !status.text || !status.className) {
		console.error("Invalid task status received: " + data.status);
	} else {
		for (const s of statusInfo) {
			btnStatus.classList.remove(s.className);
		}
		btnStatus.innerText = status.text;
		btnStatus.classList.add(status.className);
		if (data.status === archivedStatus) {
			const list = data.element.classList;
			if (showArchivedCheck && showArchivedCheck.checked) {
				list.remove(hiddenClass);
			} else {
				list.add(hiddenClass);
			}
		}
	}
	elements.id.innerText = data.id;
	elements.title.innerText = data.title;
	elements.description.innerText = data.description;
}

function removeTask(data) {
	let ind;
	if (typeof data == 'number') {
		ind = tasks.findIndex(v => v.id === data);
		data = tasks[ind];
	} else {
		ind = tasks.findIndex(v => v.id === data.id);
	}
	if (data && data.element) {
		data.element.remove();
	}
	if (ind >= 0) {
		tasks.splice(ind, 1);
	}
	updatedTasks();
}

function addTask(resData) {
	const task = taskFormat.cloneNode(true);
	const contID = task.querySelector(':nth-child(1)');
	const contTitle = task.querySelector(':nth-child(2)');
	const contDesc = task.querySelector(':nth-child(3)');
	const btnStatus = task.querySelector(':nth-child(4) button');
	const btnDelete = task.getElementsByClassName('btn-delete')[0];
	const btnEdit = task.getElementsByClassName('btn-edit')[0];
	const data = {
		...resData,
		elementID: 'task-' + resData.id,
		element: task,
		propElements: {id: contID, title: contTitle, description: contDesc, status: btnStatus}
	}
	task.id = data.elementID;
	task.classList.remove(hiddenClass);
	btnStatus.addEventListener('click', () => {
		data.status += 1;
		if (data.status >= statusInfo.length) {
			data.status = 0;
		}
		saveTask(data);
	});
	btnDelete.addEventListener('click', () => {
		deleteTask(data.id);
	});
	btnEdit.addEventListener('click', () => {
		modalShow(data);
	});
	tasks.push(data);
	updateTaskData(data);
	tableBody.append(task);
	updatedTasks();
}

function editTask(data, resData) {
	Object.assign(data, resData);
	updateTaskData(data);
}

function clearTasks(clearAll) {
	const tasksToRemove = clearAll ? [...tasks] : tasks.filter(v => v.status === completeStatus);
	for (const data of tasksToRemove) {
		removeTask(data);
	}
}

function loadStatus() {
	axios({method: 'get', url: '/api/status.php', timeout}).then(response => {
		if (response.status === 200 && response.data) {
			statusInfo = response.data;
		} else {
			console.error("STATUS DATA LOAD REQUEST STATUS " + response.status);
			console.log(response.data)
		}
	}).catch(error => {
		console.error("STATUS DATA LOAD ERROR");
		console.log(error);
	}).then(loadTasks);
}

function loadTasks() {
	axios({method: 'get', url: '/api/task.php', timeout}).then(response => {
		if (response.status === 200 && response.data) {
			for (const t of response.data) {
				addTask(t);
			}
		} else {
			console.error("TASK LOAD REQUEST STATUS " + response.status);
			console.log(response.data)
		}
	}).catch(error => {
		console.error("TASK LOAD ERROR");
		console.log(error);
	});
}

function deleteTask(id) {
	const reqData = {id, delete: true};
	axios({method: 'post', url: '/api/task.php', data: reqData, timeout}).then(response => {
		if (response.status === 200 && response.data) {
			if (response.data['success'] === true) {
				id = response.data.id;
				if (id < 0) {
					clearTasks(id === -1);
				} else {
					removeTask(id);
				}
			}
		} else {
			console.error("TASK DELETE REQUEST STATUS " + response.status);
			console.log(response.data)
		}
	}).catch(error => {
		console.error("TASK DELETE ERROR");
		console.log(error);
	});
}

function saveTask(taskData) {
	let data;
	if (!taskData) {
		data = {
			id: modalMode,
			title: (inputTitle.value || '').trim(),
			description: (inputDesc.value || '').trim()
		}
	} else {
		data = {
			id: taskData.id,
			title: taskData.title,
			description: taskData.description
		}
	}
	if (!taskData) {
		taskData = tasks.find(v => v.id === modalMode);
	}
	if (taskData) {
		data.status = taskData.status;
	}
	if (!data.title || !data.description) return;
	
	btnSave.setAttribute('disabled', '');
	modalMode = null;
	axios({method: 'post', url: '/api/task.php', data: data, timeout}).then(response => {
		if (response.status === 200 && response.data) {
			const data = tasks.find(v => v.id === response.data.id);
			if (data) {
				editTask(data, response.data);
			} else {
				addTask(response.data);
			}
		} else {
			console.error("TASK CREATE/EDIT REQUEST STATUS " + response.status);
			console.log(response.data)
		}
	}).catch(error => {
		console.error("TASK CREATE/EDIT REQUEST ERROR");
		console.log(error);
	});
	modal.hide();
	btnSave.removeAttribute('disabled');
}

function modalShow(data) {
	modalTitle.innerText = data ? editTaskTitleText.replace(/\{ID}/, data.id) : newTaskTitleText;
	modalMode = data ? data.id : -1;
	if (data) {
		inputTitle.value = data.title;
		inputDesc.value = data.description;
	}
	modal.show();
}

function modalHidden() {
	inputTitle.value = '';
	inputDesc.value = ''
	modalTitle.innerText = defaultModalTitle;
	modalMode = null;
}

function load_main() {
	taskFormat = document.getElementById('task-format');
	tableBody = document.getElementById('task-list');
	modalTitle = document.getElementById('modal-label');
	inputTitle = document.getElementById('input-title');
	inputDesc = document.getElementById('input-description');
	noDataRow = document.getElementById('empty-label');
	showArchivedCheck = document.getElementById('show-archived-check');
	modalElement = document.getElementById('task-modal');
	btnSave = document.getElementById('btn-submit-modal');
	taskCount = document.getElementById('total-tasks-label');
	modal = new bootstrap.Modal(modalElement, {
		backdrop: 'static'
	});
	defaultModalTitle = modalTitle.innerText;
	modalElement.addEventListener('hidden.bs.modal', modalHidden);
	btnSave.addEventListener('click', () => {
		saveTask(null);
	});
	showArchivedCheck.addEventListener('change', () => {
		for (const t of tasks) {
			if (t.status === archivedStatus) {
				updateTaskData(t);
			}
		}
	});
	
	const btnAdd = document.getElementById('btn-add');
	const btnClear = document.getElementById('btn-clear');
	const btnClearAll = document.getElementById('btn-clear-all');
	btnAdd.addEventListener('click', () => {
		modalShow(null);
	});
	btnClear.addEventListener('click', () => {
		deleteTask(-2);
	});
	btnClearAll.addEventListener('click', () => {
		deleteTask(-1);
	});
	
	loadStatus();
}

if (window.location.protocol == 'http:') {
	window.location.href = window.location.href.replace('http:', 'https:');
}