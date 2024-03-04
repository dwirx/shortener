const readline = require('readline');
const { exec } = require('child_process');

// Fungsi untuk mengambil input dari terminal
const getUserInput = (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

// Fungsi untuk eksekusi perintah git
const runGitCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}`);
        reject(error);
      } else {
        resolve(stdout.trim());
      }
    });
  });
};

// Menjalankan perintah git add, git commit, dan git push
const gitAddCommitPush = async () => {
  try {
    // Git add
    await runGitCommand('git add .');

    // Mengambil input pesan commit dari pengguna
    const commitMessage = await getUserInput('Masukkan pesan commit: ');

    // Git commit
    await runGitCommand(`git commit -m "${commitMessage}"`);

    // Git push
    await runGitCommand('git push');

    console.log('Perintah git add, git commit, dan git push berhasil dijalankan.');
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
  }
};

// Menggunakan fungsi untuk menjalankan perintah git
gitAddCommitPush();

