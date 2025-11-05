const logger = require('../libs/logger');
const ClientMod = require('../model/ClientMod');

const clientMod = new ClientMod();

class Client {
  async add (req, res) {
    const options = req.body;
    try {
      const r = clientMod.add(options);
      res.send({
        success: true,
        message: r
      });
    } catch (e) {
      logger.error(e);
      res.send({
        success: false,
        message: e.message
      });
    }
  };

  async delete (req, res) {
    const options = req.body;
    try {
      const r = clientMod.delete(options);
      res.send({
        success: true,
        message: r
      });
    } catch (e) {
      logger.error(e);
      res.send({
        success: false,
        message: e.message
      });
    }
  };

  async modify (req, res) {
    const options = req.body;
    try {
      const r = clientMod.modify(options);
      res.send({
        success: true,
        message: r
      });
    } catch (e) {
      logger.error(e);
      res.send({
        success: false,
        message: e.message
      });
    }
  };

  async list (req, res) {
    try {
      const r = clientMod.list();
      res.send({
        success: true,
        data: r
      });
    } catch (e) {
      logger.error(e);
      res.send({
        success: false,
        message: e.message
      });
    }
  };

  async listMainInfo (req, res) {
    try {
      const r = clientMod.listMainInfo();
      res.send({
        success: true,
        data: r
      });
    } catch (e) {
      logger.error(e);
      res.send({
        success: false,
        message: e.message
      });
    }
  };

  async listTop10 (req, res) {
    try {
      const r = clientMod.listTop10(req.query);
      res.send({
        success: true,
        data: r
      });
    } catch (e) {
      logger.error(e);
      res.send({
        success: false,
        message: e.message
      });
    }
  };

  async getSpeedPerTracker (req, res) {
    try {
      const r = await clientMod.getSpeedPerTracker();
      res.send({
        success: true,
        data: r
      });
    } catch (e) {
      logger.error(e);
      res.send({
        success: false,
        message: e.message
      });
    }
  };

  async getLogs (req, res) {
    try {
      const r = await clientMod.getLogs(req.query);
      res.send({
        success: true,
        data: r
      });
    } catch (e) {
      logger.error(e);
      res.send({
        success: false,
        message: e.message
      });
    }
  };
}

// app/controller/downloader.js 或相关文件
// app/controller/downloader.js 或相关文件
// app/controller/downloader.js 或相关文件
// app/controller/downloader.js 或相关文件

// 添加新的API端点来获取所有下载器的总速度
async getTotalSpeed() {
  const { ctx } = this;
  try {
    const downloaders = await ctx.service.downloader.getAll();
    let totalDownloadSpeed = 0;
    let totalUploadSpeed = 0;
    
    for (const downloader of downloaders) {
      if (downloader.connected) {
        const stats = await ctx.service.downloader.getStats(downloader.id);
        totalDownloadSpeed += stats.downloadSpeed || 0;
        totalUploadSpeed += stats.uploadSpeed || 0;
      }
    }
    
    ctx.body = {
      success: true,
      data: {
        totalDownloadSpeed,
        totalUploadSpeed,
        downloadSpeedFormatted: this.formatSpeed(totalDownloadSpeed),
        uploadSpeedFormatted: this.formatSpeed(totalUploadSpeed)
      }
    };
  } catch (error) {
    ctx.body = { success: false, error: error.message };
  }
}

// 格式化速度显示
formatSpeed(bytesPerSecond) {
  const units = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
  let speed = bytesPerSecond;
  let unitIndex = 0;
  
  while (speed >= 1024 && unitIndex < units.length - 1) {
    speed /= 1024;
    unitIndex++;
  }
  
  return `${speed.toFixed(2)} ${units[unitIndex]}`;
}

module.exports = Client;
