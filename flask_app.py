from flask import Flask, render_template, request
import sqlite3
import datetime
import os
import json

# Allow flask app to access database
current_dir = os.path.dirname(os.path.abspath(__file__))
db_path = current_dir + '/private/database.db'

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    """
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    sqlQuery = 'insert into myTable (myParam) values ("newMessage")'
    cursor.execute(sqlQuery)
    conn.commit()
    conn.close()
    """
    return render_template('index.html')

@app.route('/test', methods=['GET', 'POST'])
def test():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    locationsData = cursor.execute("select * from locations;")
    return "success"
    #return db_path

@app.route('/index.html', methods=['GET', 'POST'])
def get_index():
    return render_template('index.html')

@app.route('/input.html', methods=['GET', 'POST'])
def get_input():
    return render_template('input.html')
    
@app.route('/about.html', methods=['GET', 'POST'])
def get_about():
    return render_template('about.html')

# ENDPOINTS FOR ACADEMIC CAMPUS BUILDINGS
@app.route('/beardsley.html', methods=['GET', 'POST'])
def get_beardsley():
    return render_template("beardsley.html")

@app.route('/clothier.html', methods=['GET', 'POST'])
def get_clothier():
    return render_template("clothier.html")

@app.route('/kohlberg.html', methods=['GET', 'POST'])
def get_kohlberg():
    return render_template("kohlberg.html")

@app.route('/lang_center.html', methods=['GET', 'POST'])
def get_lang_center():
    return render_template("lang_center.html")

@app.route('/lang_music.html', methods=['GET', 'POST'])
def get_lang_music():
    return render_template("lang_music.html")

@app.route('/lpac.html', methods=['GET', 'POST'])
def get_lpac():
    return render_template("lpac.html")

@app.route('/mccabe.html', methods=['GET', 'POST'])
def get_mccabe():
    return render_template("mccabe.html")

@app.route('/old_tarble.html', methods=['GET', 'POST'])
def get_old_tarble():
    return render_template("old_tarble.html")

@app.route('/parish.html', methods=['GET', 'POST'])
def get_parish():
    return render_template("parish.html")

@app.route('/pearson.html', methods=['GET', 'POST'])
def get_pearson():
    return render_template("pearson.html")

@app.route('/sci.html', methods=['GET', 'POST'])
def get_sci():
    return render_template("sci.html")

@app.route('/singer.html', methods=['GET', 'POST'])
def get_singer():
    return render_template("singer.html")

@app.route('/trotter.html', methods=['GET', 'POST'])
def get_trotter():
    return render_template("trotter.html")

@app.route('/whittier.html', methods=['GET', 'POST'])
def get_whitter():
    return render_template("whittier.html")

@app.route('/test.html', methods=['GET', 'POST'])
def get_test():
    return render_template("test.html")

@app.route('/getRow', methods=['GET', 'POST'])
def get_row():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    locationsData = cursor.execute("select * from locations;")
    toReturn = []
    for row in locationsData:
        toReturn.append([row[0], row[1], row[2]])
    conn.close()
    return json.dumps(toReturn)

@app.route('/inputRow/<input_text>', methods=['GET', 'POST'])
def input_row(input_text):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    sql_command = 'insert into feedback (timestamp, input) values ("' + timestamp + '","' + input_text + '");'
    cursor.execute(sql_command)
    conn.commit()
    conn.close()
    return "" # Do we need to have a valid return, or is "" okay?

if __name__ == '__main__':
    app.run()
