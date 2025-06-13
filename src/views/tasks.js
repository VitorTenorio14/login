document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const taskList = document.getElementById('task-list');
    const taskTitle = document.getElementById('task-title');
    const taskDescription = document.getElementById('task-description');
    const addTaskBtn = document.getElementById('add-task');
    const logoutBtn = document.getElementById('logout-btn');
    const filterButtons = document.querySelectorAll('.filter-btn');
    let currentFilter = 'all';

    // Configurar filtros
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            loadTasks();
        });
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });

    // Adicionar tarefa
    addTaskBtn.addEventListener('click', async () => {
        if (taskTitle.value.trim() === '') return;

        try {
            const response = await fetch(`${API_BASE_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: taskTitle.value,
                    description: taskDescription.value
                })
            });

            if (response.ok) {
                taskTitle.value = '';
                taskDescription.value = '';
                loadTasks();
            }
        } catch (error) {
            console.error('Erro ao adicionar tarefa:', error);
        }
    });

    // Carregar tarefas
    async function loadTasks() {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const tasks = await response.json();
                renderTasks(tasks);
            }
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
        }
    }

    // Renderizar tarefas
    function renderTasks(tasks) {
        taskList.innerHTML = '';

        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'all') return true;
            if (currentFilter === 'pending') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true;
        });

        filteredTasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            taskElement.innerHTML = `
                <div class="task-info">
                    <div class="task-title">${task.title}</div>
                    <div class="task-description">${task.description}</div>
                    <small>Criado em: ${new Date(task.createdAt).toLocaleString()}</small>
                </div>
                <div class="task-actions">
                    <button class="complete-btn" data-id="${task.id}">
                        <i class="fa fa-check"></i>
                    </button>
                    <button class="delete-btn" data-id="${task.id}">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            `;

            taskList.appendChild(taskElement);
        });

        // Adicionar eventos aos botões
        document.querySelectorAll('.complete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const taskId = e.currentTarget.dataset.id;
                await toggleTaskCompletion(taskId);
                loadTasks();
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const taskId = e.currentTarget.dataset.id;
                await deleteTask(taskId);
                loadTasks();
            });
        });
    }

    // Funções auxiliares
    async function toggleTaskCompletion(taskId) {
        try {
            await fetch(`${API_BASE_URL}/tasks/${taskId}/toggle`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
        }
    }

    async function deleteTask(taskId) {
        try {
            await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Erro ao deletar tarefa:', error);
        }
    }

    // Carregar tarefas inicialmente
    loadTasks();
});