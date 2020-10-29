PATH LIST :

--------------------------------------------------------------

	"<domain>/"
	Description: Send {index} to user
	Return: Status 200(For now)

--------------------------------------------------------------

	"<domain>/api/v1/todolist"
	Description: GET all value in todolist table from database
	Return: Array<Object>

--------------------------------------------------------------

	"<domain>/api/v1/todolist/add"
	Description: Create new todo in todolist
	NEED: JSON in request body from following format:
		POST {
            todolist_ID: <String>,
			user_ID: <String or NULL>,
			name: <String>,
			description: <String>,
			state: <int>,
			expire_datetime: <String format>,
			start_datetime: <String format>,}
		}
	Return: created <Object>

--------------------------------------------------------------

	"<domain>/api/v1/todolist/update/<id>"
	Description: Update data from database by JSON in body
	NEED: JSON in request body from following format:
		PATCH {
		    <Key> : <Value>
		}
	Return: AffectedRow as <Integer>

--------------------------------------------------------------
	
	"<domain>/api/v1/todolist/delete/<id>"
    	Description: Delete record from database by ID
    	Return: deleted <Object>

--------------------------------------------------------------

<!----------------------------------------------------------->

--------------------------------------------------------------

	"<domain>/api/v1/checklist"
	Description: GET all value in todolist table from database
	Return: Array<Object>

--------------------------------------------------------------

	"<domain>/api/v1/checklist/add"
	Description: Create new todo in todolist
	NEED: JSON in request body from following format:
		POST {
            checklist_ID: <String>,
		    todolist_ID: <String or NULL>,
			name: <String>,
			description: <String>,
			state: <int>,
			expire_datetime: <String format>,
			due_datetime: <String format>,
			checklist_check: <Boolean>
		}
	Return: created <Object>

--------------------------------------------------------------

	"<domain>/api/v1/checklist/update/<id>"
	Description: Update data from database by JSON in body
	NEED: JSON in request body from following format:
		PATCH {
		    <Key> : <Value>
		}
	Return: AffectRow as <Integer>

--------------------------------------------------------------

	"<domain>/api/v1/checklist/delete/<id>"
    	Description: Delete record from database by ID
    	Return: deleted <Object>

--------------------------------------------------------------

<!----------------------------------------------------------->

--------------------------------------------------------------

	"<domain>/api/v1/user"
	Description: GET all value in user table from database
	Return: Array<Object>

--------------------------------------------------------------

	"<domain>/api/v1/user/add"
	Description: Create new todo in user
	NEED: JSON in request body from following format:
		POST {
            user_ID: <String>,
            firstname: <String>,
            lastname: <String>,
            email: <String>,
            username: <String>,
            password: <String>
		}
	Return: created <Object>

--------------------------------------------------------------

	"<domain>/api/v1/user/update/<id>"
	Description: Update data from database by JSON in body
	NEED: JSON in request body from following format:
		PATCH {
		    <Key> : <Value>
		}
	Return: AffectedRow as <Integer>

--------------------------------------------------------------
	
	"<domain>/api/v1/user/delete/<id>"
    	Description: Delete record from database by ID
    	Return: deleted <Object>

--------------------------------------------------------------

<!----------------------------------------------------------->


*** README ***

    - Error Handler:
        GET: Return Error directly as <Object>.
        POST: If error(ex. some data is null) then return error result as <Object> instead.
        UPDATE: If update success should return 1(changed) and if update not success should return 0(no change)
        DELETE: Return nothing if there is no record to delete from following ID

    - Symbol:
        < > = Value