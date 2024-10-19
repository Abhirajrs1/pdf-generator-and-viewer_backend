import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
const logger=winston.createLogger({
    level:'info',
    format:winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({timestamp,level,message,...meta})=>{
            return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta,null,2): ''}`
        })
    ),
    transports:[
        new winston.transports.Console(),
        new DailyRotateFile({
            filename: 'application-%DATE%.log',
            dirname: './logs',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true, 
            maxSize: '20m',      
            maxFiles: '7d'   
          })    
        ],
})
export default logger