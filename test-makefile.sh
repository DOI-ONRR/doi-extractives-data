#! /bin/bash

set -e

export DIR=_data
export ORIG_DIR=.original-_data

echo "Copying ${DIR} to ${ORIG_DIR}..."

rm -rf ${ORIG_DIR}
cp -R _data ${ORIG_DIR}

echo "Rebuilding ${DIR}..."

make clean
make db
make site-data

cleanup() {
  rm -rf ${DIR}
  mv ${ORIG_DIR} ${DIR}
}

echo

if diff -u -r ${DIR} ${ORIG_DIR}; then
  echo "Rebuilding ${DIR} resulted in no changes to any files. Nice."
  cleanup
else
  echo "Alas, rebuilding ${DIR} resulted in changes to some files. See"
  echo "above diff output for more details."
  cleanup
  exit 1
fi
