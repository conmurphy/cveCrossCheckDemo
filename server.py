from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/cve')
def cve():
    return render_template('cve.html')

@app.route('/eos')
def eos():
    return render_template('eos.html')


if __name__ == '__main__':
    app.run(port=3000,host= '0.0.0.0', debug=True)