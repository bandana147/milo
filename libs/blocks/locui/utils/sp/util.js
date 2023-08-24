const StatusCodes = {
  notStarted: [
    'created',
    'sync',
    'sync-done',
  ],
  inProgress: [
    'download',
    'start-glaas',
    'export',
    'waiting',
    'incoming',
  ],
}

export function getStatusLabel(status){
  let statusLabel = 'Not started';
  if (StatusCodes.notStarted.includes(status)) {
    statusLabel = 'Not started';
  } else if(StatusCodes.inProgress.includes(status)) {
    statusLabel = 'In progress';
  } else {
    statusLabel = status;
  }
  return statusLabel;
}
